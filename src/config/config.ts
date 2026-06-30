interface AppConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  appEnv: 'development' | 'production'
}

function getEnvVar(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Check that .env exists in your project root and contains ${key}.\n` +
      `See .env.example for the expected format.`
    )
  }
  return value
}

export const config: AppConfig = {
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  appEnv: import.meta.env.PROD ? 'production' : 'development',
}

if (config.appEnv === 'development') {
  console.log('✅ Config loaded:', {
    supabaseUrl: config.supabaseUrl,
    supabaseAnonKey: config.supabaseAnonKey.slice(0, 8) + '...', // never log full key
    appEnv: config.appEnv,
  })
}