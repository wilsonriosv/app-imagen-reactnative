import {StyleSheet, View, Image} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import ImageViewer from './componentes/ImageViewer';
import Button from './componentes/Button';
import IconButton from './componentes/IconButton';
import CircleButton from './componentes/CircleButton';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import EmojiPicker from './componentes/EmojiPicker';
import EmojiList from './componentes/EmojiList';
import EmojiSticker from './componentes/EmojiSticker';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions,setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);

  // Aquí se debería cargar la imagen desde un lugar y mostrarla en un ImageViewer.
  const pickImageAsync = async ()=>{
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    }else{
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    //TODO: we will implement this later
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer 
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
            />
            {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
          {showAppOptions ? (
            <View style={styles.optionsContainer}>
              <View style={styles.optionsRow}>
                <IconButton icon="refresh" label="Reset" onPress={onReset} />
                <CircleButton onPress={onAddSticker} />
                <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
              </View>
            </View>
          ) : (
            <View style={styles.footerContainer}>
              <Button label="Choose a photo" theme="primary" onPress={pickImageAsync}/>
              <Button label="Use this photo" onPress={()=>setShowAppOptions(true)}/>
            </View>
          )}
          </View>
          <EmojiPicker isVisible={isModalVisible} onClose={onModalClose} >
            <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
          </EmojiPicker>
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer:{
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});