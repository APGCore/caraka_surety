<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;
use ReflectionClass;

class AppServiceProvider extends ServiceProvider
{
  public const HOME = '/login';

  /**
   * Register any application services.
   */
  public function register(): void
  {
    $this->autoBindRepositories();
  }

  /**
   * Automatically bind all repositories with their interfaces
   */
  private function autoBindRepositories(): void
  {
    $repositoriesPath = app_path('Repositories');
    $files = File::allFiles($repositoriesPath);
    $boundInterfaces = [];

    foreach ($files as $file) {
      $class = 'App\\Repositories\\' . str_replace(
        ['/', '.php'],
        ['\\', ''],
        $file->getRelativePathname()
      );

      if (class_exists($class)) {
        $reflection = new ReflectionClass($class);
        if ($reflection->isInstantiable()) {
          $interface = $class . 'Interface';
          if (interface_exists($interface) && !in_array($interface, $boundInterfaces)) {
            $this->app->singleton($interface, function ($app) use ($class) {
              return $app->make($class);
            });
            $boundInterfaces[] = $interface;
          }
        }
      }
    }
  }

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  {
    Vite::prefetch(concurrency: 3);
  }
}
