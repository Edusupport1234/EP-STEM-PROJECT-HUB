
import { Project } from './types';

export const THEME = {
  primary: '#6b21a8', // Purple Header
  secondary: '#FFD700', // Yellow highlights
  background: '#0a0118', // Deep Space Dark
  cardBg: '#FFFFFF',
  textMain: '#FFFFFF',
  textDark: '#1a1a1a'
};

export const CATEGORIES = ['All', 'IoT', 'Robotics', 'AI', 'Electronics', '3D Printing'];

// Fix: Added AVATAR_BG constant for Dicebear robot avatars background color.
export const AVATAR_BG = 'b6e3f4';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Smart Garden Monitoring System',
    description: 'Build a system that monitors soil moisture, temperature, and light using ESP32 and sends alerts to your phone.',
    author: 'Dr. Sarah Chen',
    difficulty: 'Intermediate',
    category: 'IoT',
    thumbnail: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800',
    views: 1240,
    likes: 89,
    duration: '4 Hours',
    hardware: [
      { name: 'ESP32 Development Board', link: 'https://www.espressif.com/en/products/devkits/esp32-devkitc', image: 'https://picsum.photos/id/1/100/100' },
      { name: 'Capacitive Soil Moisture Sensor', link: 'https://www.adafruit.com/product/4026', image: 'https://picsum.photos/id/2/100/100' },
      { name: 'DHT11 Temp & Humidity Sensor', link: 'https://www.adafruit.com/product/386', image: 'https://picsum.photos/id/3/100/100' }
    ],
    software: [
      { name: 'Arduino IDE', type: 'Programming' },
      { name: 'Blynk IoT Platform', type: 'Cloud Service' }
    ],
    steps: [
      { title: 'Introduction', content: 'In this project, we will explore the fundamentals of IoT by building a smart garden.' },
      { title: 'Wiring the Sensors', content: 'Connect the VCC of both sensors to the 3.3V pin of the ESP32.' },
      { title: 'Coding with Arduino', content: 'Upload the provided code to handle sensor data reading and WiFi connection.' }
    ],
    comments: [
      { id: 'c1', author: 'Alex Rivera', text: 'This worked perfectly for my final year project! Thanks for the clear wiring diagram.', timestamp: '2 days ago', avatarColor: 'bg-green-500', likes: 12 },
      { id: 'c2', author: 'Jamie Lee', text: 'Is there a way to add a water pump to this as well?', timestamp: '5 hours ago', avatarColor: 'bg-purple-500', likes: 3 }
    ],
    publishedAt: '2023-10-15'
  },
  {
    id: '2',
    title: 'AI Hand Gesture Controller',
    description: 'Use MediaPipe and Python to control your computer volume using hand gestures and a simple webcam.',
    author: 'James Wilson',
    difficulty: 'Advanced',
    category: 'AI',
    thumbnail: 'https://images.unsplash.com/photo-1555255707-c0796c88bc21?auto=format&fit=crop&q=80&w=800',
    views: 3500,
    likes: 245,
    duration: '6 Hours',
    hardware: [
      { name: 'Computer with Webcam', link: 'https://www.logitech.com/en-us/products/webcams/c920-pro-hd-webcam.960-000764.html', image: 'https://picsum.photos/id/4/100/100' }
    ],
    software: [
      { name: 'Python 3.9+', type: 'Programming' },
      { name: 'MediaPipe', type: 'Library' },
      { name: 'OpenCV', type: 'Library' }
    ],
    steps: [
      { title: 'Setup Environment', content: 'Install the necessary libraries using pip install mediapipe opencv-python.' },
      { title: 'Hand Landmarks Detection', content: 'Detecting 21 unique hand landmarks in real-time.' }
    ],
    comments: [
      { id: 'c3', author: 'Marcus Thorn', text: 'The latency is surprisingly low. Great use of MediaPipe!', timestamp: '1 week ago', avatarColor: 'bg-blue-500', likes: 45 }
    ],
    publishedAt: '2023-11-02'
  },
  {
    id: '3',
    title: 'Micro:bit Obstacle Avoiding Robot',
    description: 'A simple entry-level robotics project using Micro:bit and ultrasonic sensors.',
    author: 'STEM Academy Team',
    difficulty: 'Beginner',
    category: 'Robotics',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    views: 890,
    likes: 42,
    duration: '2 Hours',
    makecodeUrl: 'https://makecode.microbit.org/_0hALc73qFVsj',
    hardware: [
      { name: 'Micro:bit V2', link: 'https://microbit.org/buy/', image: 'https://picsum.photos/id/5/100/100' },
      { name: 'Ultrasonic Sensor', link: 'https://www.sparkfun.com/products/15569', image: 'https://picsum.photos/id/6/100/100' },
      { name: '2WD Robot Chassis', link: 'https://www.dfrobot.com/product-367.html', image: 'https://picsum.photos/id/7/100/100' }
    ],
    software: [
      { name: 'MakeCode Editor', type: 'Blockly' }
    ],
    steps: [
      { title: 'Assembly', content: 'Mount the motors and micro:bit to the chassis.' },
      { title: 'Logic Flow', content: 'If distance < 10cm, then turn right. You can interact with the code below!', makecodeUrl: 'https://makecode.microbit.org/_0hALc73qFVsj' }
    ],
    comments: [
      { id: 'c4', author: 'Sarah Student', text: 'I love micro:bit! This was so fun to build.', timestamp: '1 day ago', avatarColor: 'bg-orange-500', likes: 5 }
    ],
    publishedAt: '2023-12-01'
  }
];
