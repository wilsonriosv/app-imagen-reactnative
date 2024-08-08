import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { View } from "react-native";

export default function EmojiSticker ({imageSize, stickerSource}) {
    const scaleImage = useSharedValue(imageSize);
    /* crear dos nuevos sharedValue: translateX y translateY
    Estos valores de traducción moverán el sticker por la pantalla. 
    Dado que el sticker se mueve a lo largo de ambos ejes, debemos 
    realizar un seguimiento de los valores X e Y por separado.
    En el useSharedValue() ganchos, hemos configurado ambas variables 
    de traducción para que tengan una posición inicial de 0. Esto 
    significa que la posición en la que se coloca inicialmente el sticker
    se considera el punto de partida. Este valor establece la 
    posición inicial del sticker cuando comienza el gesto.  */
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onStart(() => {
            if (scaleImage.value !== imageSize * 2) {
                console.log("entra a Gesture.doubleTap");
                scaleImage.value = scaleImage.value * 2;
            }
        });

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value),
        };
        });
    
    /* Crear un objeto drag para manejar el gesto de panorámica (pan gesture)
    El onChange() acepta devolución de llamada event como parámetro. 
    Las propiedades changeX y changeY mantienen el cambio de posición 
    desde el último evento. Se utilizan para actualizar los valores 
    almacenados en translateX y translateY. */
    const drag = Gesture.Pan()
    .onChange((event) => {
        console.log("Antes de cambiar los valores> translateX:",translateX.value, "translateY:",translateY.value);
      translateX.value += event.changeX;
      translateY.value += event.changeY;
      console.log("Despues de cambiar los val☻ores> translateX:",translateX.value, "translateY:",translateY.value);
    });
    
    /* utilizar el Hoock useAnimatedStyle() para devolver una serie de 
    transformaciones. Para el componente <Animated.View>. Necesitamos 
    configurar la propiedad transform de los valores translateX y translateY. 
    Esto cambiará la posición de la pegatina cuando el gesto esté activo. */
    const containerStyle = useAnimatedStyle(() => {
        return {
          transform: [
            {
              translateX: translateX.value,
            },
            {
              translateY: translateY.value,
            },
          ],
        };
      });
      
    
    return (
        <GestureDetector gesture={drag}>
          <Animated.View style={[containerStyle, { top: -350 }]}>
            <GestureDetector gesture={doubleTap}>
              <Animated.Image
                source={stickerSource}
                resizeMode="contain"
                style={[imageStyle, { width: imageSize, height: imageSize }]}
              />
            </GestureDetector>
          </Animated.View>
        </GestureDetector>
      );
}