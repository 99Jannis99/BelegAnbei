import axios from "axios";

interface Color {
  colorName: string;
  hexValue: string;
}

export const fetchColors = async (
  apiKey= "2355|WToMUmoUgzTR5w3vGk7bbiqSptz7sUfrGrMwm4Q0"
): Promise<Color[]> => {
  try {
    const response = await axios({
      method: "GET",
      url:
        "https://zylalabs.com/api/211/color+palette+api/221/get+random+palette",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      data: { model: "default" },
    });
console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};
