declare var process: Process;

interface Process {
  env: Env;
}

interface Env {
  UNSPLASH_ACCESS_KEY: string;
}

interface GlobalEnvironment {
  process: Process;
}
