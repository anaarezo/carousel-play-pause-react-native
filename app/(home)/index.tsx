import { useState, useRef, useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  Image,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width } = Dimensions.get("window");
const carouselSize = width - 24;
const progressBarWidth = 50;

const data = [
  "https://picsum.photos/1000/800",
  "https://picsum.photos/1000/801",
  "https://picsum.photos/1000/802",
  "https://picsum.photos/1000/803",
];

const ITEM_DURATION = 3;

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const progress = useSharedValue(0);
  const timerRef = useRef<number | null>(null);

  const startProgress = () => {
    clearTimeout(timerRef.current);
    progress.value = 0;
    progress.value = withTiming(1, { duration: ITEM_DURATION * 1000 });
    timerRef.current = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % data.length;
      carouselRef.current?.scrollTo({ index: nextIndex, animated: true });
    }, ITEM_DURATION * 1000);
  };

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (isPlaying) {
      startProgress();
    } else {
      progress.value = 0;
    }
  }, [isPlaying]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (isPlaying) {
      startProgress();
    }
    return () => clearTimeout(timerRef.current);
  }, [activeIndex, isPlaying]);

  const animatedProgressBar = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [0, progressBarWidth]);
  });

  const renderItem = ({ item }: { item: string }) => {
    return (
      <Image
        style={styles.img}
        source={{
          uri: item,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
        ref={carouselRef}
        loop
        width={carouselSize}
        height={carouselSize}
        onSnapToItem={(index) => {
          clearTimeout(timerRef.current);
          setActiveIndex(index);
        }}
        index={activeIndex}
        data={data}
        renderItem={renderItem}
        style={styles.carousel}
      />
      <View style={styles.controls}>
        <View style={styles.segmentedControl}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === activeIndex && styles.activeDot]}
            >
              {index === activeIndex ? (
                <Animated.View
                  style={[styles.progress, { width: animatedProgressBar }]}
                />
              ) : null}
            </View>
          ))}
        </View>
        <Pressable
          onPress={() => setIsPlaying(!isPlaying)}
          style={styles.mediaControl}
        >
          <FontAwesome
            name={isPlaying ? "pause" : "play"}
            size={12}
            color="#ff8c73"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff0f6",
  },
  carousel: {
    backgroundColor: "#ffc9e0",
    borderRadius: 999,
    margin: 12,
  },
  img: {
    width: "100%",
    height: "100%",
  },
  controls: {
    margin: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffc9e0",
    borderRadius: 999,
  },
  segmentedControl: {
    flexDirection: "row",
    padding: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 100,
    backgroundColor: "#fff0f6",
    marginHorizontal: 5,
    overflow: "hidden",
  },
  activeDot: {
    width: progressBarWidth,
  },
  progress: {
    height: 12,
    borderRadius: 100,
    backgroundColor: "#ff8c73",
  },
  mediaControl: {
    marginHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    height: 24,
    width: 24,
    borderRadius: 100,
    backgroundColor: "#fff9fd",
  },
});
