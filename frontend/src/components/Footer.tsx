export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto text-center">
        &copy; {new Date().getFullYear()} TBAE. All rights reserved.
      </div>
    </footer>
  );
}
