import React, { useState, useRef } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TextInput, 
  Pressable, 
  Alert, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform 
} from "react-native";
import { MapView, Marker } from "./MapComponent";
import * as Location from "expo-location";
import { useGeolocation } from "../hooks/useLocation";

const UserRegistryScreen = () => {
  const { locationData, errorInfo } = useGeolocation();
  const mapViewerRef = useRef(null);

  const [registry, setRegistry] = useState([]);
  const [fullName, setFullName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [town, setTown] = useState("");
  const [province, setProvince] = useState("");

  const onSavePress = async () => {
    const isFormValid = fullName && addressLine && houseNo && town && province;
    
    if (!isFormValid) {
      Alert.alert("Campos Inválidos", "Por favor, informe todos os dados para continuar.");
      return;
    }

    const searchAddress = `${addressLine}, ${houseNo}, ${town}, ${province}`;
    
    try {
      const geoResponse = await Location.geocodeAsync(searchAddress);
      
      if (geoResponse && geoResponse.length > 0) {
        const { latitude, longitude } = geoResponse[0];
        
        const registeredTag = {
          uuid: Math.random().toString(),
          personName: fullName,
          completeAddress: searchAddress,
          latitude,
          longitude
        };
        
        setRegistry((currentList) => [...currentList, registeredPerson]);
        
        if (mapViewerRef.current) {
          mapViewerRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          }, 800);
        }
        
        setFullName("");
        setAddressLine("");
        setHouseNo("");
        setTown("");
        setProvince("");
        
        Alert.alert("Feito", "O cadastro da tag foi salvo e posicionado no mapa.");
      } else {
        Alert.alert("Ops!", "Não achamos esse endereço, tente novamente.");
      }
    } catch (e) {
      Alert.alert("Erro de Rede", "Tivemos um problema de conexão. Verifique a internet.");
    }
  };

  if (errorInfo) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.alertText}>{errorInfo}</Text>
      </View>
    );
  }
  
  if (!locationData) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.statusText}>Aguardando sinal GPS...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.mapSection}>
          <MapView
            ref={mapViewerRef}
            style={styles.mapElement}
            initialRegion={{
              latitude: locationData.lat,
              longitude: locationData.lng,
              latitudeDelta: 0.012,
              longitudeDelta: 0.012,
            }}
            showsUserLocation={true}
          >
            {registry.map((person) => (
              <Marker
                key={person.uuid}
                coordinate={{ latitude: person.latitude, longitude: person.longitude }}
                title={person.personName}
                description={person.completeAddress}
              />
            ))}
          </MapView>
        </View>

        <View style={styles.cardSection}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Cadastrar Tag</Text>
            
            <TextInput 
              style={styles.textInput} 
              placeholder="Nome de tag " 
              value={fullName} 
              onChangeText={setFullName} 
              placeholderTextColor="#9ca3af"
            />
            
            <TextInput 
              style={styles.textInput} 
              placeholder="Endereço (Rua/Av)" 
              value={addressLine} 
              onChangeText={setAddressLine} 
              placeholderTextColor="#9ca3af"
            />
            
            <View style={styles.rowLayout}>
              <TextInput 
                style={[styles.textInput, styles.halfBox]} 
                placeholder="Número" 
                value={houseNo} 
                onChangeText={setHouseNo} 
                keyboardType="numeric" 
                placeholderTextColor="#9ca3af"
              />
              <TextInput 
                style={[styles.textInput, styles.halfBox]} 
                placeholder="Estado (UF)" 
                value={province} 
                onChangeText={setProvince} 
                maxLength={2}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <TextInput 
              style={styles.textInput} 
              placeholder="Cidade" 
              value={town} 
              onChangeText={setTown} 
              placeholderTextColor="#9ca3af"
            />
            
            <Pressable 
              style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.8 }]} 
              onPress={onSavePress}
            >
              <Text style={styles.btnText}>Salvar Tag</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  keyboardView: {
    flex: 1,
  },
  mapSection: {
    flex: 1.5,
  },
  mapElement: {
    width: '100%',
    height: '100%',
  },
  cardSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6,
    marginTop: -20, // Overlaps the map slightly
  },
  heading: {
    fontSize: 22,
    color: '#1f2937',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    height: 50,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 16,
    color: '#374151',
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfBox: {
    width: '48%',
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    marginTop: 12,
    fontSize: 15,
    color: '#4b5563',
  },
  alertText: {
    fontSize: 15,
    color: '#ef4444',
    textAlign: 'center',
    paddingHorizontal: 30,
    fontWeight: '500',
  },
});

export default UserRegistryScreen;
