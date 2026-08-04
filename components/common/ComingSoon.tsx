import { Rocket, Sparkles } from 'lucide-react';

interface ComingSoonProps {
  size?: 'small' | 'normal' | 'large';
}

const SIZES = {
  small: {
    container: 'py-8',
    sparkles: 'w-10 h-10',
    rocket: 'w-2 h-2',
    rocketPos: '-top-2 -right-2',
    title: 'text-2xl',
    description: 'text-xs',
    iconMb: 'mb-4',
    dotsMt: 'mt-2',
  },
  normal: {
    container: 'py-20',
    sparkles: 'w-14 h-14',
    rocket: 'w-6 h-6',
    rocketPos: '-top-4 -right-4',
    title: 'text-3xl',
    description: 'text-sm',
    iconMb: 'mb-6',
    dotsMt: 'mt-4',
  },
  large: {
    container: 'py-24',
    sparkles: 'w-18 h-18',
    rocket: 'w-10 h-10',
    rocketPos: '-top-6 -right-6',
    title: 'text-4xl',
    description: 'text-base',
    iconMb: 'mb-8',
    dotsMt: 'mt-6',
  },
};

const ComingSoon = ({ size = 'normal' }: ComingSoonProps) => {
  const currentSize = SIZES[size];

  return (
    <div
      className={`flex flex-col items-center justify-center bg-white text-center rounded-xl ${currentSize.container}`}
    >
      {/* Icon */}
      <div className={`relative ${currentSize.iconMb}`}>
        <Sparkles
          className={`${currentSize.sparkles} text-[#1B56CC] animate-pulse`}
        />
        <Rocket
          className={`${currentSize.rocket} text-[#4E7AF7] absolute ${currentSize.rocketPos} animate-bounce`}
        />
      </div>

      {/* Text */}
      <h1 className={`${currentSize.title} font-semibold text-[#041B4B] mb-2`}>
        {'Coming Soon'}
      </h1>

      <p className={`${currentSize.description} text-gray-500 max-w-xs`}>
        {'This feature is coming soon'}
      </p>

      {/* Animated dots */}
      <div className={`flex gap-1 ${currentSize.dotsMt}`}>
        <span className='w-2 h-2 bg-[#4E7AF7] rounded-full animate-bounce [animation-delay:0ms]' />
        <span className='w-2 h-2 bg-[#4E7AF7] rounded-full animate-bounce [animation-delay:150ms]' />
        <span className='w-2 h-2 bg-[#4E7AF7] rounded-full animate-bounce [animation-delay:300ms]' />
      </div>
    </div>
  );
};

export default ComingSoon;
