import { Request, Response } from 'express';
import Stripe from 'stripe';
import { config } from '../config/env';
import { membersService } from '../services/members.service';
import { logger } from '../utils/logger';

// Initialize Stripe client
const stripe = config.stripeSecretKey
  ? new Stripe(config.stripeSecretKey)
  : null;

export const stripeWebhookController = {
  handleStripeWebhook: async (req: Request, res: Response): Promise<void> => {
    if (!stripe) {
      logger.error('Stripe client not configured. Check STRIPE_SECRET_KEY.');
      res.status(500).json({ error: 'Stripe not configured' });
      return;
    }

    if (!config.stripeWebhookSecret) {
      logger.error('STRIPE_WEBHOOK_SECRET is not set.');
      res.status(500).json({ error: 'Webhook secret not configured' });
      return;
    }

    const sig = req.headers['stripe-signature'];

    if (!sig) {
      logger.warn('Missing stripe-signature header');
      res.status(400).json({ error: 'Missing signature' });
      return;
    }

    let event: Stripe.Event;

    try {
      // req.body is a raw Buffer due to express.raw middleware
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripeWebhookSecret
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Webhook signature verification failed: ${message}`);
      res.status(400).json({ error: `Invalid signature: ${message}` });
      return;
    }

    logger.info(`Received Stripe event: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await membersService.createMemberFromStripeSession(session);
          break;
        }
        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }

      // Always return 200 to acknowledge receipt
      // Even if member was already active (skip case), we still return success
      res.json({ received: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Webhook processing error: ${message}`, err);
      // Return 500 so Stripe can retry
      res.status(500).json({ error: 'Processing failed' });
    }
  },
};

