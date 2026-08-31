import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-gray-800">
          Product Not Found
        </h2>
        <p className="mt-2 text-gray-500">
          The product you’re looking for doesn’t exist or has been removed.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-md bg-red-500 px-6 py-2 text-white font-medium hover:bg-red-600 transition"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
}
