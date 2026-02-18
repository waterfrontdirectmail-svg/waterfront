// Compatibility shim - re-exports service client as supabaseAdmin
import { createServiceClient } from '@/lib/supabase/server';

export const supabaseAdmin = createServiceClient();
