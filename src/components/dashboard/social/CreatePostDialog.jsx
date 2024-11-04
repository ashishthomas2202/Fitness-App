"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiImage } from "react-icons/fi";
import { FaCheck, FaGlobeAmericas, FaUsers } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { toast } from "react-toastify";
import { Carousel } from "@/components/dashboard/social/Carousel";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2, PlusIcon } from "lucide-react";

// Define Yup schema for validation
const postSchema = yup.object().shape({
  contentData: yup.object({
    content: yup.string(),
  }),
  visibility: yup
    .string()
    .oneOf(
      ["public", "private"],
      "Visibility must be either public or private."
    )
    .required("Visibility is required."),
});

export const CreatePostDialog = ({ createPost = async () => {} }) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      contentData: {
        content: "",
      },
      visibility: "public",
    },
    resolver: yupResolver(postSchema),
  });

  const handleOrderChange = (items) => {
    setSelectedFiles(items);
  };

  const generateThumbnail = async (videoFile) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoFile);
      video.muted = true;
      video.playsInline = true;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      video.addEventListener("loadeddata", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 0.5; // Capture frame at 0.5 seconds
      });

      video.addEventListener("seeked", () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob)); // Create a URL for the thumbnail
        }, "image/jpeg");

        video.remove();
        URL.revokeObjectURL(video.src);
      });

      video.onerror = () => reject("Failed to generate thumbnail");
    });
  };
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);

    const uniqueFiles = files.filter((file) => {
      const isDuplicate = selectedFiles.some(
        (selectedFile) =>
          selectedFile.file.name === file.name &&
          selectedFile.file.size === file.size
      );

      // Show toast if the file is a duplicate
      if (isDuplicate) {
        toast.warn(`${file.name} is already added.`, {
          autoClose: 3000,
        });
      }

      return !isDuplicate; // Only include non-duplicate files
    });

    const filesWithPreview = await Promise.all(
      uniqueFiles.map(async (file) => {
        if (file.type.includes("video")) {
          const thumbnailUrl = await generateThumbnail(file);
          return {
            url: URL.createObjectURL(file),
            file: file,
            thumbnail: thumbnailUrl, // Add thumbnail for video files
          };
        }

        // For images, just create a preview URL
        return {
          url: URL.createObjectURL(file),
          file: file,
        };
      })
    );

    // Update selectedFiles with new unique files
    setSelectedFiles((prev) => [...prev, ...filesWithPreview]);

    // Reset the input field value
    event.target.value = "";
  };

  const handleDeleteMedia = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const checkSubmit = () => {
    const content = watch("contentData.content");
    const hasContent = content && content.trim().length > 0;
    const hasMedia = selectedFiles.length > 0;
    return !hasContent && !hasMedia;
  };

  useEffect(() => {
    setSubmitButtonDisabled(checkSubmit());
  }, [watch("contentData.content"), selectedFiles]);

  const onSubmit = async (data) => {
    setSubmitButtonDisabled(true);
    setSubmitting(true);
    try {
      let mediaData = [];

      if (selectedFiles.length > 0) {
        // Define the folder path with user ID and current date
        const folderName = `social/${session.user.id}/${
          new Date().toISOString().split("T")[0]
        }`;

        setImageUploadLoading(true);

        // Use uploadFiles to upload all media files and get the URLs with metadata
        mediaData = await uploadFiles(
          folderName,
          selectedFiles.map((file) => file.file)
        );

        setImageUploadLoading(false);

        if (!mediaData) {
          throw new Error("Failed to upload media files");
        }
      }

      // Structure the post object with the uploaded media data
      const post = {
        author: session?.user?.id,
        contentType: "post",
        contentData: {
          content: data.contentData.content,
        },
        visibility: data.visibility,
        media: mediaData,
        likes: [], // Initialize likes array
        comments: [], // Initialize comments array
      };

      // Call the createPost function with the structured post object
      await createPost(post);
      toast.success("Post created successfully");
      reset();
      setSelectedFiles([]);
      setOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
      setSubmitButtonDisabled(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className="rounded-full h-16 w-16 md:h-auto md:w-auto p-0 md:py-2 md:px-4 flex justify-center items-center shadow-black shadow-2xl bg-gradient-to-tl from-violet-400 to-violet-600 hover:from-violet-500 hover:to-violet-700 dark:from-violet-300 dark:to-violet-700 dark:hover:from-violet-400 dark:hover:to-violet-800"
        >
          <p className="hidden md:block">Create Post</p>
          <span className="md:hidden">
            <PlusIcon size={30} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a New Post</DialogTitle>
        <DialogDescription className="hidden">post</DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Textarea
            id="content"
            className="border-none placeholder:text-light focus-visible:shadow-inner focus-visible:ring-0 focus-visible:bg-slate-100 dark:focus-visible:bg-neutral-950 bg-slate-50 dark:bg-neutral-900 resize-none"
            placeholder="Share anything on your mind..."
            {...register("contentData.content")}
          />
          {errors.contentData?.content && (
            <div className="text-red-500 text-sm">
              {errors.contentData.content.message}
            </div>
          )}

          {selectedFiles && selectedFiles.length > 0 && (
            <div>
              <Carousel
                media={selectedFiles}
                updateOrder={handleOrderChange}
                deleteMedia={handleDeleteMedia}
                mutate
              />
            </div>
          )}

          {/* Media Upload Button */}
          <div className="flex items-center space-x-4">
            {/* Media Upload Button */}
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <label className="cursor-pointer p-2 rounded-full hover:bg-violet-100 dark:hover:bg-neutral-900">
                    <span className="text-xl dark:text-white">
                      <FiImage />
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple // Allow multiple file selection
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload Media</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Visibility Selection */}
            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                variant="ghost"
                className="p-2 rounded-full hover:bg-violet-100 dark:hover:bg-neutral-900"
              >
                {watch("visibility") === "public" ? (
                  <span className="text-xl">
                    <FaGlobeAmericas />
                  </span>
                ) : (
                  <span className="text-xl">
                    <FaUsers />
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setValue("visibility", "public")}
                >
                  <span className="text-lg mr-2">
                    <FaGlobeAmericas />
                  </span>{" "}
                  Everyone
                  {watch("visibility") == "public" && (
                    <span className="text-[10px] ml-2">
                      <FaCheck />
                    </span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setValue("visibility", "private")}
                >
                  <span className="text-lg mr-2">
                    <FaUsers />
                  </span>
                  Followers
                  {watch("visibility") == "private" && (
                    <span className="text-[10px] ml-2">
                      <FaCheck />
                    </span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={submitButtonDisabled}
          >
            {imageUploadLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Image Uploading
                <span>
                  <span className="animate-bounce delay-75">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-150">.</span>
                </span>
              </div>
            ) : submitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Please wait
                <span>
                  <span className="animate-bounce delay-75">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-150">.</span>
                </span>
              </div>
            ) : (
              "Submit Post"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const uploadFiles = async (folderName, filesArray) => {
  // Prepare form data for each file
  const formData = new FormData();
  filesArray.forEach((file) => formData.append("files", file));
  formData.append("folderName", folderName);
  // Make a POST request to the API endpoint with the array of files

  return await axios
    .post("/api/imagekit/upload-files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response?.data?.success) {
        const uploadedFiles = response?.data?.data;
        console.log("Uploaded Files:", uploadedFiles);
        const mediaData = uploadedFiles.map((file) => {
          if (
            file.fileType == "image" ||
            (file.fileType == "non-image" && file.videoCodec)
          )
            return {
              url: file.url,
              type:
                file.fileType == "image"
                  ? "image"
                  : file.fileType == "non-image" && file.videoCodec
                  ? "video"
                  : "file",
              metadata: {
                size: file.size,
                resolution:
                  file.fileType == "image" || file.fileType == "non-image"
                    ? { width: file.width, height: file.height }
                    : null,
              },
            };
          return;
        });

        return mediaData;
      }
      return null;
    })
    .catch((error) => {
      return null;
    });
};
