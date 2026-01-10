import { useMemo } from "react";
import {
    ActionSheetIOS,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function SelectField({
  label,
  placeholder = "Select",
  value,
  onChange,
  options = [],
  colors,
  fontFamily = { regular: "outfit", medium: "outfit-medium" },
}) {
  const data = useMemo(() => {
    return options.map((opt) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    );
  }, [options]);

  const safeValue = value ?? "";

  const openIOSActionSheet = () => {
    const labels = data.map((d) => d.label);
    const cancelButtonIndex = labels.length; // last one
    const sheetOptions = [...labels, "Cancel"];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: sheetOptions,
        cancelButtonIndex,
        title: label?.replace("*", "").trim() || placeholder,
      },
      (buttonIndex) => {
        if (buttonIndex === cancelButtonIndex) return;
        const chosen = data[buttonIndex]?.value;
        if (chosen !== undefined) onChange(chosen);
      }
    );
  };

  return (
    <View style={styles.inputContainer}>
      {!!label && (
        <Text style={[styles.label, { fontFamily: fontFamily.regular }]}>
          {label}
        </Text>
      )}

      {Platform.OS === "android" ? (
        <Dropdown
          style={[styles.dropdown, { backgroundColor: colors.WHITE }]}
          containerStyle={styles.dropdownContainer}
          placeholderStyle={[
            styles.dropdownPlaceholder,
            { fontFamily: fontFamily.regular },
          ]}
          selectedTextStyle={[
            styles.dropdownSelected,
            { fontFamily: fontFamily.regular },
          ]}
          itemTextStyle={[
            styles.dropdownItemText,
            { fontFamily: fontFamily.regular },
          ]}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          value={safeValue || null}
          onChange={(item) => onChange(item.value)}
        />
      ) : (
        <TouchableOpacity
          style={[styles.iosField, { backgroundColor: colors.WHITE }]}
          activeOpacity={0.8}
          onPress={openIOSActionSheet}
        >
          <Text
            style={[
              styles.iosFieldText,
              { fontFamily: fontFamily.regular },
              !safeValue && { color: "#999" },
            ]}
          >
            {safeValue
              ? data.find((d) => d.value === safeValue)?.label ?? safeValue
              : placeholder}
          </Text>
          <Text style={[styles.chevron, { color: "#999" }]}>⌵</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    marginVertical: 6,
  },

  // ANDROID dropdown (react-native-element-dropdown)
  dropdown: {
    height: 56,
    borderRadius: 7,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  dropdownContainer: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  dropdownPlaceholder: {
    color: "#999",
  },
  dropdownSelected: {
    color: "#333",
  },
  dropdownItemText: {
    color: "#333",
  },

  // IOS field (ActionSheet)
  iosField: {
    height: 56,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iosFieldText: {
    color: "#333",
    flex: 1,
  },
  chevron: {
    marginLeft: 10,
    fontSize: 14,
  },
});
