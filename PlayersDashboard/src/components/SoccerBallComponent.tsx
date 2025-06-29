import { Box } from "@mui/material";
import soccerBall from "../assets/soccer-ball.svg";

/**
 * Background soccer ball decoration component.
 * Displays a large, semi-transparent soccer ball image in the bottom-right corner.
 */
const SoccerBallComponent = () => {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 700,
          height: 700,
          opacity: 0.18,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <img
          src={soccerBall}
          alt="soccer ball background"
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
    </>
  );
};

export default SoccerBallComponent;
