import {StyleSheet, View, Image, Platform} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import ImageViewer from './componentes/ImageViewer';
import Button from './componentes/Button';
import IconButton from './componentes/IconButton';
import CircleButton from './componentes/CircleButton';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import EmojiPicker from './componentes/EmojiPicker';
import EmojiList from './componentes/EmojiList';
import EmojiSticker from './componentes/EmojiSticker';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions,setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Utilizamos el Hoock useRef() de React y creamos una variable imageRef
  const imageRef = useRef();
  const [pickedEmoji, setPickedEmoji] = useState(null);
  /* Crear una const para manejar el status del permiso de acceso a media
  Cuando la aplicación se carga por primera vez y el estado del permiso 
  no se concede ni se deniega, el valor del status es null. Cuando se le 
  solicita permiso, un usuario puede otorgarlo o denegarlo. Podemos 
  agregar una condición para verificar si es null, y si es así, active 
  el requestPermission() método */
  const [status, requestPermission] = MediaLibrary.usePermissions();
  if (status === null) {
    requestPermission();
    //Una vez que se da el permiso, el valor de la status cambios a granted. 
  }

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
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Saved!');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });
  
        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer 
              placeholderImageSource={PlaceholderImage}
              selectedImage={selectedImage}
              />
              {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
          </View>
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