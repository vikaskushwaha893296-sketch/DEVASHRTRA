import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('[Devashtra DB] No MONGODB_URI detected in environment. Running in resilient memory-store mode.');
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    // Connect with a 4-second timeout so app boot is instantaneous if DB is unreachable
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[Devashtra DB] Successfully connected to MongoDB (${mongoose.connection.host})`);
    return true;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[Devashtra DB] MongoDB connection failed: ${errorMsg}. Falling back to memory-store mode.`);
    isConnected = false;
    return false;
  }
}

export function isMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
