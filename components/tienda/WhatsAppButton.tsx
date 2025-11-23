import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a 
      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`}
      target="_blank"
      className="fixed bottom-20 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 z-20 cursor-pointer"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}