import { z } from "zod";
import { generateUUID } from "@/lib/utils";

export interface RealEstateProperty {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  price: number;
  priceUnit?: string;
  type: string;
  typeDisplay: string; 
  area: number;
  description: string;
  imageUrl: string;
  images?: string[];
  legalStatus?: string;
  direction?: string;
  transactionType?: string;
}

export const mockRealEstateData: RealEstateProperty[] = [
  {
    id: "1",
    name: "Căn hộ hiện đại trung tâm",
    location: "Quận 1, TPHCM",
    lat: 10.777,
    lng: 106.699,
    price: 3.5,
    type: "apartment",
    typeDisplay: "Căn hộ",
    area: 120,
    description: "Căn hộ 3 phòng ngủ sang trọng với view thành phố",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
  },
  {
    id: "2",
    name: "Nhà ở ngoại ô gia đình",
    location: "Quận 2, TPHCM",
    lat: 10.803,
    lng: 106.775,
    price: 5.2,
    type: "house",
    typeDisplay: "Nhà ở",
    area: 180,
    description: "Nhà 4 phòng ngủ với sân vườn và hồ bơi",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
  },
  {
    id: "3",
    name: "Không gian thương mại",
    location: "Quận 3, TPHCM",
    lat: 10.789,
    lng: 106.691,
    price: 2.8,
    type: "commercial",
    typeDisplay: "Thương mại",
    area: 250,
    description: "Không gian thương mại đắc địa để bán lẻ hoặc văn phòng",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
  },
  {
    id: "4",
    name: "Mảnh đất ven sông",
    location: "Quận 7, TPHCM",
    lat: 10.783,
    lng: 106.73,
    price: 4.1,
    type: "land",
    typeDisplay: "Đất đai",
    area: 500,
    description: "Mảnh đất đẹp với view sông",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
  },
  {
    id: "5",
    name: "Penthouse cao cấp",
    location: "Quận 1, TPHCM",
    lat: 10.785,
    lng: 106.707,
    price: 8.9,
    type: "apartment",
    typeDisplay: "Căn hộ",
    area: 350,
    description: "Penthouse sang trọng với view toàn cảnh thành phố",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
  },
  {
    id: "6",
    name: "Studio tiện nghi",
    location: "Quận 4, TPHCM",
    lat: 10.771,
    lng: 106.697,
    price: 1.5,
    type: "apartment",
    typeDisplay: "Căn hộ",
    area: 45,
    description: "Studio hiện đại hoàn hảo cho các chuyên gia trẻ",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
  },
];

export function filterRealEstate(input: {
  location?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  type?: "apartment" | "house" | "land" | "commercial" | "all";
}) {
  const { location, priceRange, type } = input;

  let filtered = mockRealEstateData;

  if (location) {
    filtered = filtered.filter((prop) =>
      prop.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (type && type !== "all") {
    filtered = filtered.filter((prop) => prop.type === type);
  }

  if (priceRange) {
    if (priceRange.min !== undefined) {
      filtered = filtered.filter((prop) => prop.price >= priceRange.min!);
    }
    if (priceRange.max !== undefined) {
      filtered = filtered.filter((prop) => prop.price <= priceRange.max!);
    }
  }

  return {
    properties: filtered,
    count: filtered.length,
    message: `Tìm thấy ${filtered.length} dự án bất động sản phù hợp với tiêu chí của bạn`,
  };
}

type GetRealEstateProps = {
  session: any;
  dataStream: any;
};

export const getRealEstate = ({ session, dataStream }: GetRealEstateProps) => ({
  description:
    "Tìm kiếm bất động sản theo địa điểm, khoảng giá và loại. Trả về các dự án có tọa độ để hiển thị bản đồ.",
  inputSchema: z.object({
    location: z
      .string()
      .optional()
      .describe("Địa điểm hoặc khu vực để tìm kiếm bất động sản"),
    priceRange: z
      .object({
        min: z.number().optional().describe("Giá tối thiểu tính bằng triệu"),
        max: z.number().optional().describe("Giá tối đa tính bằng triệu"),
      })
      .optional()
      .describe("Bộ lọc khoảng giá"),
    type: z
      .enum(["apartment", "house", "land", "commercial", "all"])
      .optional()
      .default("all")
      .describe("Loại bất động sản"),
  }),
  execute: async (input: any) => {
    const id = generateUUID();
    const result = filterRealEstate(input);

    dataStream.write({
      type: "data-kind",
      data: "realEstate",
      transient: true,
    });

    dataStream.write({
      type: "data-id",
      data: id,
      transient: true,
    });

    dataStream.write({
      type: "data-title",
      data: "Dự án Bất động sản",
      transient: true,
    });

    dataStream.write({
      type: "data-clear",
      data: null,
      transient: true,
    });

    dataStream.write({
      type: "data-realEstateDelta",
      data: result.properties,
      transient: true,
    });

    dataStream.write({ type: "data-finish", data: null, transient: true });

    return {
      id,
      title: "Dự án Bất động sản",
      kind: "realEstate",
      content: result.message,
      properties: result.properties,
    };
  },
});
