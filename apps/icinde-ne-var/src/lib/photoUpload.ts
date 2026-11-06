import * as ImageManipulator from "expo-image-manipulator";
import { File } from "expo-file-system";
import { supabase } from "./supabase";

const MAX_EDGE = 1024;
const JPEG_COMPRESS = 0.8;

export async function uploadPhoto(localUri: string): Promise<string> {
  const resized = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: MAX_EDGE } }],
    { compress: JPEG_COMPRESS, format: ImageManipulator.SaveFormat.JPEG },
  );

  const file = new File(resized.uri);
  const arrayBuffer = await file.arrayBuffer();
  const fileName = `photos/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(fileName, arrayBuffer, { contentType: "image/jpeg", upsert: false });

  if (error) throw new Error(`Fotoğraf yüklenemedi: ${error.message}`);
  return `uploads/${fileName}`;
}
