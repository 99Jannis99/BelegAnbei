import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import { useDownloadFile } from "../../Functions/updateImages";

function ChangeColor() {
  const downloadFile = useDownloadFile();
  const { background, primary } = useSelector((state) => state.colorReducer);

  const welcomeImageArray = [
    "https://marketplace.canva.com/EAE-xnqWvJk/1/0/1600w/canva-retro-smoke-and-round-light-desktop-wallpapers-JLofAI27pCg.jpg",
    "https://c4.wallpaperflare.com/wallpaper/39/346/426/digital-art-men-city-futuristic-night-hd-wallpaper-thumb.jpg",
    "https://img.freepik.com/fotos-kostenlos/ein-gemaelde-eines-bergsees-mit-einem-berg-im-hintergrund_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1696982400&semt=ais",
    "https://t3.ftcdn.net/jpg/05/85/86/44/360_F_585864419_kgIYUcDQ0yiLOCo1aRjeu7kRxndcoitz.jpg",
    "https://images7.alphacoders.com/128/1280269.jpg",
    "https://c4.wallpaperflare.com/wallpaper/374/528/976/ai-art-sunset-sports-car-lamborghini-synthwave-hd-wallpaper-thumb.jpg",
    "https://images5.alphacoders.com/132/1325121.png",
    "https://img.freepik.com/fotos-kostenlos/schneebedeckter-berggipfel-unter-sternenklarer-galaxie-majestaetischer-generativer-ki_188544-9650.jpg",
  ];

  const logoImageArray = [
    "https://assets.stickpng.com/images/580b57fcd9996e24bc43c51f.png",
    "https://purepng.com/public/uploads/large/purepng.com-disney-logologobrand-logoiconslogos-251519939495wtv86.png",
    "https://upload.wikimedia.org/wikipedia/de/thumb/7/70/Porsche_Logo.svg/2560px-Porsche_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia-logo.png/1200px-Kia-logo.png",
    "https://static.vecteezy.com/system/resources/thumbnails/011/653/653/small/eco-friendly-smart-city-logo-design-blue-fullcolor-png.png",
    "https://www.ilgfood.de/app/uploads/2017/02/Coca-Cola-Logo-PNG.png",
    "https://danielkalman.ch/wp-content/uploads/2018/01/PNGPIX-COM-FedEx-Logo-PNG-Transparent.png",
    "https://upload.wikimedia.org/wikipedia/commons/1/14/FRONT3X-Logo.png",
    "https://about.gitlab.com/images/press/logo/png/gitlab-logo-100.png",
  ];

  let lastRandomIndex = null;

  const downloadRandomImage = async (array, image) => {
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * array.length);
    } while (randomIndex === lastRandomIndex);

    lastRandomIndex = randomIndex; // Speichern Sie den aktuellen Index, um ihn beim nächsten Aufruf zu überprüfen

    const randomImageUrl = array[randomIndex];
    try {
      await downloadFile(randomImageUrl, image);
    } catch (error) {
      console.error("Download error in ChangeImage.tsx:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: primary }]}
        onPress={() => {
          downloadRandomImage(welcomeImageArray, "welcomeImage");
          downloadRandomImage(logoImageArray, "logoImage");
        }}
      >
        <Text style={[styles.text, { color: background }]}>get new image</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F1F",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "white",
  },
  button: {
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default ChangeColor;
