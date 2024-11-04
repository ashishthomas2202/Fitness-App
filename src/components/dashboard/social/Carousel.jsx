import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { PiCards } from "react-icons/pi";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";
import Image from "next/image";

export const Carousel = ({
  media = [],
  updateOrder = () => {},
  deleteMedia = () => {},
  mutate = false,
}) => {
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState("view"); // mutate

  if (!media || media.length === 0) return null;

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleDeleteMedia = (index) => {
    deleteMedia(index);
    if (media.length === 1) {
      setCurrent(null);
    } else if (current >= index) {
      setCurrent((prev) => (prev - 1 + media.length - 1) % (media.length - 1));
    }
  };

  return (
    <div
      className={cn(
        "relative w-full aspect-square flex items-center justify-center bg-slate-50 shadow-inner dark:bg-neutral-900 rounded-lg overflow-hidden",
        mode == "mutate" && "items-start"
      )}
    >
      {mode == "view" ? (
        media.map((m, index) => {
          const { url, file } = m;
          const isImage = file?.type?.includes("image");
          const isVideo = file?.type?.includes("video");
          const isSelected = current === index;

          const metadata = m?.file?.metadata || {};
          // console.log(m);

          return (
            <div
              key={`${url}-${index}-images`}
              className={`relative w-full h-full ${
                isSelected ? "block" : "hidden"
              }`}
            >
              {isImage ? (
                <Image
                  src={url} // Use uploaded URL or preview URL
                  alt={`${
                    metadata?.size ? `Size: ${metadata.size} bytes` : ""
                  } ${
                    metadata?.resolution
                      ? `Resolution: ${metadata.resolution.width}x${metadata.resolution.height}`
                      : ""
                  }`}
                  className="object-cover w-full h-full"
                  sizes="80vw sm:60vw md:40vw lg:30vw"
                  fill
                  priority={index === current}
                />
              ) : isVideo ? (
                <video
                  src={url} // Use uploaded URL or preview URL
                  autoPlay
                  loop
                  className="object-cover w-full h-full"
                />
              ) : null}
              {mutate && (
                <button
                  type="button"
                  className="absolute bottom-2 right-2 bg-white dark:bg-neutral-900 hover:bg-slate-100  dark:hover:bg-neutral-950 text-rose-500 shadow h-10 w-10 p-2 flex justify-center items-center rounded-full"
                  onClick={() => handleDeleteMedia(index)}
                >
                  <Trash2 size={20} />
                </button>
              )}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/30 p-1 rounded-full">
                {media.map((mx, i) => (
                  <div
                    className={cn(
                      "w-1 h-1 bg-black dark:bg-slate-300 rounded-full mx-1",
                      i == current ? "ring-2 ring-violet-500 bg-violet-500" : ""
                    )}
                    key={`${url}-${i}-indicators`}
                  ></div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <MutateMedia
          media={media}
          current={current}
          updateOrder={updateOrder}
          deleteMedia={handleDeleteMedia}
        />
      )}

      {/* Navigation Buttons */}
      {mode == "view" && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-violet-500 hover:bg-violet-600 dark:bg-neutral-900 dark:hover:bg-neutral-950 transition-all duration-100 text-white p-2 h-10 w-10 rounded-full"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-violet-500 hover:bg-violet-600 dark:bg-neutral-900 dark:hover:bg-neutral-950 transition-all duration-100 text-white p-2 h-10 w-10 rounded-full"
          >
            <ChevronRight />
          </button>
        </>
      )}
      {mutate && (
        <>
          <button
            type="button"
            className="absolute bottom-2 left-2 bg-white dark:bg-neutral-800 hover:bg-slate-100  dark:hover:bg-neutral-900 shadow text-2xl h-10 w-10 p-2 flex justify-center items-center rounded-full"
            onClick={() =>
              setMode((prev) => (prev === "view" ? "mutate" : "view"))
            }
          >
            <PiCards />
          </button>
        </>
      )}
    </div>
  );
};

const MutateMedia = ({
  media = [],
  updateOrder = () => {},
  deleteMedia = () => {},
}) => {
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    const generatePreviews = async () => {
      const previewWithIds = await Promise.all(
        media.map(async (m, index) => {
          if (m.file?.type.includes("video") && !m.thumbnail) {
            // Only generate a thumbnail if it hasn't been generated
            const thumbnailUrl = await generateThumbnail(m.file);
            return {
              ...m,
              id: m.id || `${m.file.name}-${index}`,
              thumbnail: thumbnailUrl,
            };
          }
          return { ...m, id: m.id || `${m.file.name}-${index}` };
        })
      );

      setPreview(previewWithIds);
    };

    generatePreviews();
  }, [media]);

  const handleDrag = (sourceId, sourceIndex, targetIndex) => {
    const newOrder = swap(preview, sourceIndex, targetIndex);
    console.log(newOrder);
    // setPreview(newOrder);
    updateOrder(newOrder); // Update the parent component
  };

  return (
    <GridContextProvider onChange={handleDrag}>
      <div className="flex w-full h-full overflow-y-auto">
        <GridDropZone
          id="media-grid"
          boxesPerRow={3}
          rowHeight={150}
          className="flex-1 gap-2"
        >
          {preview.map((m, index) => {
            const { url, file, id, thumbnail } = m;
            const isImage = file?.type?.includes("image");
            const isVideo = file?.type?.includes("video");
            const metadata = m?.file?.metadata || {};

            return (
              <GridItem key={id}>
                <div
                  className="p-2"
                  style={{
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    className="relative w-full h-full aspect-square rounded-xl overflow-hidden p-2 "
                    style={{
                      backgroundImage: `url(${isImage ? url : thumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <button
                      type="button"
                      className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-neutral-800 text-rose-500 rounded-full flex justify-center items-center"
                      onClick={() => deleteMedia(index)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                {/* <div className="relative w-full h-full aspect-square rounded-xl overflow-hidden p-2">
                {isImage ? (
                  <img
                    src={url}
                    alt={`${
                      metadata?.size ? `Size: ${metadata.size} bytes` : ""
                    } ${
                      metadata?.resolution
                        ? `Resolution: ${metadata.resolution.width}x${metadata.resolution.height}`
                        : ""
                    }`}
                    className="object-cover w-full h-full"
                  />
                ) : isVideo ? (
                  <video
                    src={url}
                    autoPlay
                    loop
                    className="object-cover w-full h-full"
                  />
                ) : null}
                <button
                  type="button"
                  className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-neutral-800 text-rose-500 rounded-full flex justify-center items-center"
                  onClick={() => deleteMedia(index)}
                >
                  <Trash2 size={20} />
                </button>
              </div> */}
              </GridItem>
            );
          })}
        </GridDropZone>
      </div>
    </GridContextProvider>
  );
};

// const MutateMedia = ({
//   media = [],
//   current,
//   updateOrder = () => {},
//   deleteMedia = () => {},
// }) => {
//   const [preview, setPreview] = useState(media);

//   useEffect(() => {
//     setPreview(media);
//   }, [media]);

//   return (
//     <div className="grid grid-cols-3 gap-2 items-start p-2">
//       {preview.map((m, index) => {
//         const { url, file } = m;
//         const isImage = file?.type?.includes("image");
//         const isVideo = file?.type?.includes("video");
//         const metadata = m?.file?.metadata || {};

//         return (
//           <div
//             key={index}
//             className={cn(
//               `relative w-full h-full aspect-square rounded-xl overflow-hidden`,
//               index === current ? "border-2 border-violet-500" : ""
//             )}
//           >
//             {isImage ? (
//               <img
//                 src={url} // Use uploaded URL or preview URL
//                 alt={`${metadata?.size ? `Size: ${metadata.size} bytes` : ""} ${
//                   metadata?.resolution
//                     ? `Resolution: ${metadata.resolution.width}x${metadata.resolution.height}`
//                     : ""
//                 }`}
//                 className="object-cover w-full h-full"
//               />
//             ) : isVideo ? (
//               <video
//                 src={url} // Use uploaded URL or preview URL
//                 autoPlay
//                 loop
//                 className="object-cover w-full h-full"
//               />
//             ) : null}
//             <button
//               type="button"
//               className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-neutral-800 text-rose-500 rounded-full flex justify-center items-center"
//               onClick={() => deleteMedia(index)}
//             >
//               <Trash2 size={20} />
//             </button>
//           </div>
//         );
//       })}
//     </div>
//   );
// };
