import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface MediaSliderProps {
  images: { src: string; alt: string }[];
}

export function MediaSlider({ images }: MediaSliderProps) {
  return (
    <Carousel opts={{ loop: true }} className="w-full">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.src}>
            <img
              src={image.src}
              alt={image.alt}
              className="aspect-[16/10] w-full rounded-md object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
