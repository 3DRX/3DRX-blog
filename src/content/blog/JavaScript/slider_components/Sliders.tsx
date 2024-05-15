import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

const TempSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className="relative flex w-full touch-none select-none items-center"
    {...props}
  >
    <SliderPrimitive.Track className="relative h-10 w-full grow overflow-hidden rounded-2xl bg-zinc-200">
      <SliderPrimitive.Range className="absolute h-full bg-zinc-900" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="border-primary ring-black/50 ring-offset-background focus-visible:ring-ring block h-[50px] w-3 rounded-full bg-zinc-50 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      asChild
    >
      <div className="flex flex-col">
        <div className="grow" />
        <div className="mx-auto block h-5 w-0.5 rounded-full bg-black" />
        <div className="grow" />
      </div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
TempSlider.displayName = SliderPrimitive.Root.displayName;

const WindSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className="relative flex w-full touch-none select-none items-center"
    {...props}
  >
    <SliderPrimitive.Track className="relative h-10 w-full grow overflow-hidden rounded-xl bg-gradient-to-r from-gray-100 to-green-400 disabled:opacity-50 dark:from-gray-100/90 dark:to-green-500/70">
      <SliderPrimitive.Range className="bg-primary/0 absolute h-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="border-primary ring-offset-background focus-visible:ring-ring block h-10 w-3 rounded-2xl border-0 bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      asChild
    >
      <div className="flex flex-col">
        <div className="grow" />
        <div className="mx-auto block h-5 w-0.5 rounded-full bg-black" />
        <div className="grow" />
      </div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
WindSlider.displayName = SliderPrimitive.Root.displayName;

export { TempSlider, WindSlider };
