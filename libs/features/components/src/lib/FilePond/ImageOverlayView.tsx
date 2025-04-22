import { animated, useSpring } from '@react-spring/web';
import { FILE_STATES } from '@rpldy/uploady';
import styled from 'styled-components';

export interface ImageOverlayViewProps {
  id: string;
  state: FILE_STATES;
}

export const ImageOverlayView = (props: ImageOverlayViewProps) => {
  const { opacity } = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: {
      mass: 25,
    },
  });

  return (
    <Container state={props.state} style={{ opacity }}>
      <svg
        className="w-full"
        height="100"
        viewBox="0 0 500 200"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient
            id={`gradient-${props.id}`}
            cx=".5"
            cy="1.25"
            r="1.15"
          >
            <stop offset="50%" stopColor="#000000" />
            <stop offset="56%" stopColor="#0a0a0a" />
            <stop offset="63%" stopColor="#262626" />
            <stop offset="69%" stopColor="#4f4f4f" />
            <stop offset="75%" stopColor="#808080" />
            <stop offset="81%" stopColor="#b1b1b1" />
            <stop offset="88%" stopColor="#dadada" />
            <stop offset="94%" stopColor="#f6f6f6" />
            <stop offset="100%" stopColor="#ffffff" />
          </radialGradient>
          <mask id={`mask-${props.id}`}>
            <rect
              x="0"
              y="0"
              width="500"
              height="200"
              fill={`url(#gradient-${props.id})`}
            ></rect>
          </mask>
        </defs>
        <rect
          x="0"
          width="500"
          height="200"
          fill="currentColor"
          mask={`url(#mask-${props.id})`}
        ></rect>
      </svg>
    </Container>
  );
};

const Container = styled(animated.div)<{ state: FILE_STATES }>`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  color: ${({ state }) => {
    switch (state) {
      case FILE_STATES.FINISHED:
        return '#369763';
      case FILE_STATES.ABORTED:
      case FILE_STATES.CANCELLED:
      case FILE_STATES.ERROR:
        return '#c44e47';
      default:
        return '#64605e';
    }
  }};
`;

export default ImageOverlayView;
