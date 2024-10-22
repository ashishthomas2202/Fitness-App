import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export const revalidate = 60;
export async function GET(req) {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  return Response.json(
    {
      success: true,
      data: authenticationParameters,
    },
    { status: 200 }
  );
}
