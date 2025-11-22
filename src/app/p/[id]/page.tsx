import { notFound } from 'next/navigation';
import { getBlobUrl } from '@/lib/blob';

export const dynamic = 'force-dynamic';

export default function ImagePage({ params }: { params: { id: string } }) {
  const imageUrl = getBlobUrl(`uploads/${params.id}`);
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img 
            src={imageUrl}
            alt="Gambar yang diunggah"
            className="w-full h-auto"
            onError={(e) => {
              // Fallback ke gambar default jika gagal memuat
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
            }}
          />
          <div className="p-4">
            <h1 className="text-xl font-semibold mb-2">Gambar Berhasil Diunggah</h1>
            <p className="text-gray-600 mb-4">Gambar ini telah dikompres dan siap dibagikan.</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">URL Halaman:</p>
                <div className="bg-gray-50 p-3 rounded-md overflow-x-auto">
                  <code className="text-sm break-all">
                    {`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/p/${params.id}`}
                  </code>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">URL Gambar Langsung:</p>
                <div className="bg-gray-50 p-3 rounded-md overflow-x-auto">
                  <code className="text-sm break-all">{imageUrl}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const imageUrl = getBlobUrl(`uploads/${params.id}`);
  
  return {
    title: 'Gambar yang dibagikan',
    description: 'Gambar yang diunggah melalui layanan kompresi gambar',
    openGraph: {
      title: 'Gambar yang dibagikan',
      description: 'Gambar yang diunggah melalui layanan kompresi gambar',
      url: `${baseUrl}/p/${params.id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Gambar yang diunggah',
        },
      ],
      type: 'website',
      siteName: 'Hosting Gambar Cepat',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Gambar yang dibagikan',
      description: 'Gambar yang diunggah melalui layanan kompresi gambar',
      images: [imageUrl],
    },
  };
}
