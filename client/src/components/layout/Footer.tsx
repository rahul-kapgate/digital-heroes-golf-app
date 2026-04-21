import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">Digital Heroes</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Golf. Give. Win. A platform where your game creates impact.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/how-it-works" className="hover:text-primary">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link to="/charities" className="hover:text-primary">Charities</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terms" className="hover:text-primary">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-primary">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2026 Digital Heroes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
