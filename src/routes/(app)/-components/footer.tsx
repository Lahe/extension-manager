import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, Github, Heart, Twitter } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-background flex w-full justify-center border-t py-6">
      <div className="container">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-8 py-4 md:grid-cols-4">
          {/* Company/App info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-md">
                <span className="text-primary-foreground text-xs font-bold">EX</span>
              </div>
              <span className="font-semibold">Extensions Hub</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Manage and discover browser extensions with ease.
            </p>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-medium">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-medium">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="font-medium">Connect</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" asChild>
                <a href="#" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="#" aria-label="Website">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Bottom footer */}
        <div className="flex flex-col items-center justify-between pt-2 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {year} Extensions Hub. All rights reserved.
          </p>
          <p className="text-muted-foreground mt-4 flex items-center text-sm md:mt-0">
            Made with <Heart className="mx-1 h-3 w-3 text-red-500" /> for developers
          </p>
        </div>
      </div>
    </footer>
  )
}
