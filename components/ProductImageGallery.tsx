'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function ProductImageGallery({ images, name, featured }: { images: string[], name: string, featured: boolean }) {
    const defaultImage = (images && images.length > 0) ? images[0] : '/images/placeholder.jpg'
    const [mainImage, setMainImage] = useState(defaultImage)

    return (
        <div className="flex flex-col gap-4">
            <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md">
                <Image
                    src={mainImage}
                    alt={name}
                    fill
                    className="object-contain"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {featured && (
                        <span className="badge bg-gray-900 text-white border-gray-700 shadow-sm">⭐ Featured</span>
                    )}
                </div>
            </div>

            {images && images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img: string, i: number) => (
                        <div
                            key={i}
                            onClick={() => setMainImage(img)}
                            className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border bg-white cursor-pointer transition-all ${mainImage === img ? 'border-blue-600 shadow-md scale-105' : 'border-gray-200 shadow-sm hover:border-blue-400'}`}
                        >
                            <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
