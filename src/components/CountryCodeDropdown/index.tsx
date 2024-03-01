import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const CountryCodeDropdown = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('+91');

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionSelect = (value) => {
    setSelectedValue(value);
    toggleDropdown();
  };

  const renderOptions = () => {
    return (
      <View style={styles.optionsContainer}>
        <TouchableOpacity onPress={() => handleOptionSelect('+91')}>
          <Text style={styles.optionText}>+91</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleOptionSelect('+1')}>
          <Text style={styles.optionText}>+1</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>{selectedValue}</Text>
      </TouchableOpacity>
      {dropdownVisible && renderOptions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  dropdownButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  optionsContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 8,
  },
});

export default CountryCodeDropdown;
