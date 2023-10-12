import axios from "axios";
import { useDispatch } from "react-redux";
import { setBackground, setPrimary } from "../redux/actions";

export const useColors = () => {
  const dispatch = useDispatch();

  const fetchColors = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: "http://colormind.io/api/",
        data: {
          model: "default"
        }
      });
      if (response.data.result && response.data.result.length >= 2) {
        // Konvertiere die ersten beiden Farbarrays in RGB-Strings
        const color1 = `rgb(${response.data.result[0].join(",")})`;
        const color2 = `rgb(${response.data.result[2].join(",")})`;

        // Verwende die konvertierten Farben für die Aktionen
        dispatch(setBackground(color1));
        dispatch(setPrimary(color2));
      }
    } catch (error) {
      throw error;
    }
  };

  return { fetchColors };
};
