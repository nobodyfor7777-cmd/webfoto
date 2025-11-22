import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { decodeBlobPath, getAppBaseUrl, getBlobUrl } from "@/lib/blob";

export const dynamic = "force-dynamic";

export default function ImagePage({ params }: { params: { id: string } }) {
  const objectKey = decodeBlobPath(params.id);

  if (!objectKey) {
    notFound();
  }

  const imageUrl = getBlobUrl(objectKey);
  const pageUrl = `${getAppBaseUrl()}/p/${params.id}`;
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Gambar yang diunggah"
            className="w-full h-auto"
            onError={(event) => {
              const target = event.currentTarget;
              target.onerror = null;
              target.src = "/placeholder-image.jpg";
            }}
          />
          <div className="p-4">
            <h1 className="text-xl font-semibold mb-2">Gambar Berhasil Diunggah</h1>
            <p className="text-gray-600 mb-4">Gambar ini telah dikompres dan siap dibagikan.</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">URL Halaman:</p>
                <div className="bg-gray-50 p-3 rounded-md overflow-x-auto">
                  <code className="text-sm break-all">{pageUrl}</code>
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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const objectKey = decodeBlobPath(params.id);

  if (!objectKey) {
    notFound();
  }

  const baseUrl = getAppBaseUrl();
  const imageUrl = getBlobUrl(objectKey);
  const pageUrl = `${baseUrl}/p/${params.id}`;
  
  return {
    title: 'Gambar yang dibagikan',
    description: 'Gambar yang diunggah melalui layanan kompresi gambar',
    openGraph: {
      title: 'Gambar yang dibagikan',
      description: 'Gambar yang diunggah melalui layanan kompresi gambar',
      url: pageUrl,
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
