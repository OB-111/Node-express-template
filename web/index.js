import { join } from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import serveStatic from 'serve-static';
import bodyParser from 'body-parser';
import shopify from './shopify.js';
import webhooks from './webhooks.js';
import cors from 'cors';
import {PrismaClient} from '@prisma/client';
import '@shopify/shopify-api/adapters/node'; 
import {shopifyApi} from '@shopify/shopify-api';


// Connection to prisma
const prisma = new PrismaClient();
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);


// trying to create session tokens
const shopifyToken = shopifyApi({
	apiKey: process.env.SHOPIFY_API_KEY ,
	apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY,
	scopes: ['read_products'],
	// hostName: 'ngrok-tunnel-address',
	hostName:'https://home-assignment-73.myshopify.com/'
  });
  
const STATIC_PATH =
	process.env.NODE_ENV === 'production'
		? `${process.cwd()}/frontend/dist`
		: `${process.cwd()}/frontend/`;

const app = express();
app.use(bodyParser.json());

// Configure CORS
const corsOptions = {
	origin: 'https://home-assignment-73.myshopify.com',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	allowedHeaders: 'Content-Type,Authorization',
	credentials: true,
  }; 
// Session is built by the OAuth process
await shopify.rest.StorefrontAccessToken.all({
	session: session,
  });
app.use(cors(corsOptions));// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
	shopify.config.auth.callbackPath,
	shopify.auth.callback(),
	shopify.redirectToShopifyOrAppRoot()
);
app.post(
	shopify.config.webhooks.path,
	// @ts-ignore
	shopify.processWebhooks({ webhookHandlers: webhooks })
);

// All endpoints after this point will require an active session
app.use('/api/*', shopify.validateAuthenticatedSession());

app.use(express.json());

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use('/*', shopify.ensureInstalledOnShop(), async (_req, res) => {
	return res.set('Content-Type', 'text/html').send(readFileSync(join(STATIC_PATH, 'index.html')));
});


// Routes
/// API endpoint to save cart
app.post('/api/save-cart', async (req, res) => {
	const { customerId, cartData } = req.body;
  
	try {
	  // Use Prisma to create or update saved cart
	  const savedCart = await prisma.savedCart.upsert({
		where: {
		  customerId: customerId,
		},
		update: {
		  cartData: cartData,
		},
		create: {
		  customerId: customerId,
		  cartData: cartData,
		},
	  });
  
	  res.json({ success: true, message: 'Cart saved successfully' });
	} catch (error) {
	  console.error('Error saving cart:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });

/// API endpoint to get cart details
app.get('/api/retrieve-cart', async (req, res) => {
	const { customerId } = req.query;
  
	try {
	  // Query the SavedCart table using Prisma
	  const savedCart = await prisma.savedCart.findFirst({
		where: {
		  customerId: customerId,
		},
	  });
  
	  if (!savedCart) {
		return res.status(404).json({ error: 'Saved cart not found' });
	  }
  
	  res.json({ success: true, cartData: savedCart.cartData });
	} catch (error) {
	  console.error('Error retrieving saved cart:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });

app.listen(PORT,() => {
	console.log(`Server is running on port ${PORT}`)});
