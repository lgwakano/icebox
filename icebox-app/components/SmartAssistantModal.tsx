import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { AgenticOrchestrator } from '../services/AgenticOrchestrator';
import { useFridge } from '../app/context/FridgeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SmartAssistantModal({ visible, onClose }: Props) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const { addItem } = useFridge();

  const handleSubmit = async () => {
    if (!prompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setResponse('');
    
    try {
      const res = await AgenticOrchestrator.executeTask(prompt, { addItem });
      setResponse(res.message);
    } catch (e: any) {
      setResponse("An error occurred: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPrompt('');
    setResponse('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <BlurView intensity={80} tint="dark" style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <View className="bg-white rounded-t-3xl pt-6 pb-10 px-6 shadow-xl" style={{ minHeight: 400 }}>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-sky-100 rounded-full items-center justify-center mr-3">
                  <Feather name="cpu" size={20} color="#0ea5e9" />
                </View>
                <Text className="text-2xl font-black text-slate-800">Smart Assistant</Text>
              </View>
              <Pressable onPress={handleClose} className="p-2 bg-slate-100 rounded-full">
                <Feather name="x" size={24} color="#64748b" />
              </Pressable>
            </View>

            {/* Response Area */}
            <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
              {response ? (
                <View className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
                  <Text className="text-slate-700 text-base leading-6 font-medium">{response}</Text>
                </View>
              ) : (
                <View className="items-center justify-center py-10 opacity-60">
                  <Feather name="message-square" size={48} color="#94a3b8" />
                  <Text className="text-slate-500 text-center mt-4 font-medium px-4">
                    Tell me what you bought, and I'll figure out where it goes and how long it lasts.
                  </Text>
                  <Text className="text-slate-400 text-sm text-center mt-2 italic">
                    e.g. "I bought 2 cartons of almond milk"
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View className="flex-row items-end space-x-3">
              <View className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl px-5 py-3 min-h-[50px] justify-center shadow-sm">
                <TextInput
                  className="text-slate-800 text-base flex-1"
                  placeholder="I bought some apples..."
                  placeholderTextColor="#94a3b8"
                  value={prompt}
                  onChangeText={setPrompt}
                  multiline
                  maxLength={200}
                />
              </View>
              <Pressable 
                onPress={handleSubmit}
                disabled={isLoading || !prompt.trim()}
                className={`w-[50px] h-[50px] rounded-full items-center justify-center shadow-md ${isLoading || !prompt.trim() ? 'bg-slate-300' : 'bg-sky-500'}`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Feather name="arrow-up" size={24} color="white" />
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
}
