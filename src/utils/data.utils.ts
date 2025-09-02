import config from "@/config";

export const formatDate = (date: Date): string => {
    const formatted = date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    return formatted;
}

export const getFileFromURL = async (url: string): Promise<File | undefined> => {
   try {
        const response = await fetch(url as string);
        const blob = await response.blob();
        const Filename = url?.replace(`${config.bucketUrl}`, '');
        const file = new File([blob], Filename || 'file', {
            type: blob.type,
        });
        return file as File || undefined;
   } catch (error) {
         console.error("Error fetching file from URL:", error);
   }
}

export const generateProductCode = (num: number, brandId: number, categoryId: number, unitId: number ): string => {
    const prefix = "PRD";
    return `${prefix}-${formatIndex(num)}-${formatIndex(brandId ?? 0)}-${formatIndex(categoryId ?? 0)}-${formatIndex(unitId ?? 0)}`
}

export const generateTransactionCodeIn = (num: number): string => {
    const prefix = "TRI";
    return `${prefix}-${formatIndex(num)}`
}

export const generateTransactionCodeOut = (num: number): string => {
    const prefix = "TRO";
    return `${prefix}-${formatIndex(num)}`
}

export const generateTransactionCodeMutation = (num: number): string => {
    const prefix = "TRM";
    return `${prefix}-${formatIndex(num)}`
}

export const formatIndex = (num: number) => {
  const paddedIndex = num > 999 ? String(num).padStart(4, '0') : String(num).padStart(3, '0');
  return paddedIndex;
}

export const getProductPlace = (toWareHouse: boolean, toStore: { id: number; name: string } | null): string => {
    if (toWareHouse) {
        return "Gudang";
    } else if (toStore) {
        return `${toStore.name}`;
    } else {
        return "Tidak diketahui";
    }
}

