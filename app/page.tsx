import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            AI Website Builder
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Build Your Institution's
            <span className="text-blue-600"> Website with AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Create professional, dynamic websites for educational institutions using our
            AI-powered drag-and-drop builder. No coding required.
          </p>

          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg">
                Start Building Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Drag & Drop Builder</h3>
            <p className="text-gray-600">
              Visually design your pages with our intuitive drag-and-drop interface.
              No coding skills needed.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">AI-Powered</h3>
            <p className="text-gray-600">
              Use natural language commands to build pages. AI generates content and
              suggests improvements.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Server-Driven UI</h3>
            <p className="text-gray-600">
              Update your website instantly without redeployment. Changes go live
              immediately.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
