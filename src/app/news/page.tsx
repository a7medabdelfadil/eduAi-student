"use client";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import Box from "~/_components/Box";
import Container from "~/_components/Container";
import ImageComponent from "~/_components/ImageSrc";
import { Text } from "~/_components/Text";
import { useGetAllNews, useLikePost } from "~/APIs/hooks/useNews";
import { Skeleton } from "~/components/ui/skeleton";
const News = () => {
  const { data, isLoading, refetch } = useGetAllNews();
  const { mutate: likePost } = useLikePost();

  const handleLikeClick = (postId: number, liked: boolean) => {
    likePost(
      { postId, liked },
      {
        onSuccess: () => {
          void refetch(); // Only refetch posts after successful like/unlike mutation
        },
      },
    );
  };
  if (isLoading) {
    return (
      <Container>
        <Box>
          <Text font={"bold"} size={"2xl"}>
            News
          </Text>
          <div className="flex justify-center">
            <div className="mt-8 w-4/5 space-y-6 md:w-3/4 xl:w-2/3">
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  shadow="md"
                  border="borderPrimary"
                  className="space-y-4 p-4"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-[60px] w-[60px] rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-[300px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-1/6" />
                </Box>
              ))}
            </div>
          </div>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Box>
          <Text font={"bold"} size={"2xl"}>
            News
          </Text>
          <div className="flex justify-center">
            <div className="mt-8 w-4/5 md:w-3/4 xl:w-2/3">
              {data.data.content.map((newsItem: any) => (
                <Box
                  key={newsItem.id}
                  shadow="md"
                  border="borderPrimary"
                  className="mb-10"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <ImageComponent
                        fallbackSrc="/images/noImage.png"
                        priority={true}
                        src={newsItem.publisherPicture}
                        alt="Profile Photo"
                        width={50}
                        height={50}
                        className="h-[60px] w-[60px] rounded-full"
                      />
                      <div className="flex flex-col">
                        <Text font={"semiBold"} size={"xl"}>
                          {newsItem.publisherName}
                        </Text>
                        <Text color={"gray"}>1h ago</Text>
                      </div>
                    </div>
                    <Text font={"medium"} size={"xl"} className="mt-4">
                      {newsItem.content}
                    </Text>
                    <div
                      className={`mt-4 grid gap-3 ${
                        newsItem.attachments.length === 1
                          ? "grid-cols-1"
                          : newsItem.attachments.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-2 md:grid-cols-3"
                      }`}
                    >
                      {newsItem.attachments.map((img: any) => (
                        <ImageComponent
                          fallbackSrc="/images/noImage.png"
                          priority={true}
                          key={img.id}
                          src={img.viewLink}
                          alt="Attachment"
                          width={750}
                          height={750}
                          className="max-h-[300px] w-full rounded-xl object-cover md:max-h-[400px] lg:max-h-[500px]"
                        />
                      ))}
                    </div>
                    
                  </div>
                  <hr className="mt-7" />
                  <div className="mt-2 flex gap-3">
                    <button className="flex items-center gap-1">
                      {newsItem?.isLiked ? (
                        <HiMiniHeart
                          color="red"
                          size={30}
                          onClick={() => handleLikeClick(newsItem.id, false)}
                        />
                      ) : (
                        <HiOutlineHeart
                          size={30}
                          onClick={() => handleLikeClick(newsItem.id, true)}
                        />
                      )}

                      <Text font={'semiBold'}>{newsItem?.likesCount}</Text>
                    </button>
                  </div>
                </Box>
              ))}
            </div>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default News;
