
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const INITIAL_MENU = [
  {
    id: "1",
    name: "Bruschetta",
    course: "Starter",
    description:
      "Crisp artisanal ciabatta topped with vine-ripened tomatoes, fresh basil, and extra virgin olive oil.",
    price: 85,
  },
  {
    id: "2",
    name: "Grilled Lamb Chops",
    course: "Main",
    description:
      "Succulent loin chops basted in rosemary-infused butter, served with a delicate roasted garlic jus.",
    price: 220,
  },
  {
    id: "3",
    name: "Chocolate Fondant",
    course: "Dessert",
    description:
      "Warm Belgian chocolate cake with a rich molten center, served alongside hand-churned vanilla bean ice cream.",
    price: 95,
  },
  {
    id: "4",
    name: "Butternut Soup",
    course: "Starter",
    description:
      "Silky roasted butternut broth accented with ginger-spiced cream and toasted pumpkin seeds.",
    price: 70,
  },
  {
    id: "5",
    name: "Linefish of the Day",
    course: "Main",
    description:
      "Pan-seared coastal catch served with butter-steamed vegetables and fresh lemon-herb emulsion.",
    price: 195,
  },
];

const COURSE_OPTIONS = ["Starter", "Main", "Dessert"];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    course: "Starter",
    description: "",
    price: "",
  });

  const editingDish = useMemo(
    () => menu.find((item) => item.id === editingId),
    [menu, editingId]
  );

  const resetForm = () => {
    setForm({
      name: "",
      course: "Starter",
      description: "",
      price: "",
    });
  };

  const openAdd = () => {
    resetForm();
    setScreen("add");
  };

  const openEdit = (dish) => {
    setEditingId(dish.id);
    setForm({
      name: dish.name,
      course: dish.course,
      description: dish.description,
      price: String(dish.price),
    });
    setScreen("edit");
  };

  const saveDish = () => {
    const price = Number(form.price);

    if (!form.name.trim() || !form.description.trim() || !price) {
      Alert.alert("Incomplete dish", "Please complete all fields and enter a valid price.");
      return;
    }

    if (screen === "edit") {
      setMenu((current) =>
        current.map((item) =>
          item.id === editingId
            ? { ...item, ...form, name: form.name.trim(), description: form.description.trim(), price }
            : item
        )
      );
    } else {
      setMenu((current) => [
        ...current,
        {
          id: Date.now().toString(),
          name: form.name.trim(),
          course: form.course,
          description: form.description.trim(),
          price,
        },
      ]);
    }

    resetForm();
    setEditingId(null);
    setScreen("menu");
  };

  const deleteDish = (id) => {
    Alert.alert("Delete dish", "Are you sure you want to remove this dish from the menu?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setMenu((current) => current.filter((item) => item.id !== id)),
      },
    ]);
  };

  const Header = ({ title, back = "home", right }) => (
    <View style={styles.header}>
      <Pressable onPress={() => setScreen(back)} style={styles.backButton}>
        <Ionicons name="chevron-back" size={18} color="#222" />
        <Text style={styles.backText}>{back === "home" ? "Home" : "Menu"}</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      {right || <View style={{ width: 62 }} />}
    </View>
  );

  const CourseBadge = ({ course }) => (
    <View
      style={[
        styles.badge,
        course === "Starter" && styles.starterBadge,
        course === "Main" && styles.mainBadge,
        course === "Dessert" && styles.dessertBadge,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          course === "Starter" && styles.starterText,
          course === "Main" && styles.mainText,
          course === "Dessert" && styles.dessertText,
        ]}
      >
        {course.toUpperCase()}
      </Text>
    </View>
  );

  const DishCard = ({ dish }) => (
    <View style={styles.dishCard}>
      <View style={styles.dishTopRow}>
        <Text style={styles.dishName}>{dish.name}</Text>
        <CourseBadge course={dish.course} />
      </View>

      <Text style={styles.dishDescription}>{dish.description}</Text>

      <View style={styles.dishBottomRow}>
        <Text style={styles.price}>R{dish.price}</Text>
        <View style={styles.actions}>
          <Pressable onPress={() => openEdit(dish)} style={styles.iconButton}>
            <Ionicons name="create-outline" size={19} color="#555" />
          </Pressable>
          <Pressable
            onPress={() => deleteDish(dish.id)}
            style={[styles.iconButton, styles.deleteButton]}
          >
            <Ionicons name="trash-outline" size={18} color="#e85c63" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  const HomeScreen = () => (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f7f5" />
      <ScrollView contentContainerStyle={styles.homeContent}>
        <View style={styles.chefIcon}>
          <Ionicons name="restaurant-outline" size={27} color="#e28700" />
        </View>

        <Text style={styles.brand}>Christoffel's Kitchen</Text>
        <Text style={styles.subtitle}>Kitchen Head & Menu Manager</Text>

        <View style={styles.countPill}>
          <Ionicons name="book-outline" size={14} color="#d88700" />
          <Text style={styles.countText}>Total items on menu: {menu.length}</Text>
        </View>

        <View style={styles.homeButtons}>
          <HomeButton
            icon="add"
            title="Add Item"
            subtitle="Create a new culinary dish"
            iconBg="#fff2bd"
            iconColor="#e28700"
            onPress={openAdd}
          />
          <HomeButton
            icon="list-outline"
            title="View Menu"
            subtitle="Browse and manage active list"
            iconBg="#dff2fb"
            iconColor="#1685aa"
            onPress={() => setScreen("menu")}
          />
          <HomeButton
            icon="create-outline"
            title="Update Item"
            subtitle="Edit dishes and adjust pricing"
            iconBg="#f5e4f9"
            iconColor="#a94dc1"
            onPress={() => {
              if (menu.length) openEdit(menu[0]);
              else Alert.alert("No dishes", "Add a dish before updating one.");
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const HomeButton = ({ icon, title, subtitle, iconBg, iconColor, onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.homeButton, pressed && { opacity: 0.75 }]}
    >
      <View style={[styles.homeButtonIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.homeButtonText}>
        <Text style={styles.homeButtonTitle}>{title}</Text>
        <Text style={styles.homeButtonSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#777" />
    </Pressable>
  );

  const FormScreen = ({ editing = false }) => (
    <SafeAreaView style={styles.safe}>
      <Header title={editing ? "Edit Dish" : "Add New Dish"} back={editing ? "menu" : "home"} />

      <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
        <Field label="DISH NAME">
          <TextInput
            value={form.name}
            onChangeText={(name) => setForm((f) => ({ ...f, name }))}
            placeholder="e.g. Grilled Lamb Chops"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
        </Field>

        <Field label="COURSE">
          <View style={styles.courseRow}>
            {COURSE_OPTIONS.map((course) => (
              <Pressable
                key={course}
                onPress={() => setForm((f) => ({ ...f, course }))}
                style={[
                  styles.courseOption,
                  form.course === course && styles.courseOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.courseOptionText,
                    form.course === course && styles.courseOptionTextActive,
                  ]}
                >
                  {course}
                </Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="DESCRIPTION">
          <TextInput
            value={form.description}
            onChangeText={(description) => setForm((f) => ({ ...f, description }))}
            placeholder="Briefly describe culinary ingredients, taste, and preparation method..."
            placeholderTextColor="#aaa"
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.descriptionInput]}
          />
        </Field>

        <Field label="PRICE">
          <View style={styles.priceInputWrap}>
            <Text style={styles.currency}>R</Text>
            <TextInput
              value={form.price}
              onChangeText={(price) => setForm((f) => ({ ...f, price: price.replace(/[^0-9]/g, "") }))}
              placeholder="0.00"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              style={[styles.input, styles.priceInput]}
            />
          </View>
        </Field>

        <View style={styles.formButtons}>
          <Pressable onPress={saveDish} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              {editing ? "Save Changes" : "Save to Menu"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              resetForm();
              setEditingId(null);
              setScreen(editing ? "menu" : "home");
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const MenuScreen = () => (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Full Menu"
        back="home"
        right={
          <Pressable onPress={openAdd} style={styles.addCircle}>
            <Ionicons name="add" size={22} color="#d88700" />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.menuContent}>
        {menu.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}

        {!menu.length && (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={42} color="#bbb" />
            <Text style={styles.emptyTitle}>Your menu is empty</Text>
            <Text style={styles.emptyText}>Add your first culinary dish to get started.</Text>
            <Pressable onPress={openAdd} style={styles.smallPrimaryButton}>
              <Text style={styles.primaryButtonText}>Add Dish</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  if (screen === "home") return <HomeScreen />;
  if (screen === "menu") return <MenuScreen />;
  if (screen === "add") return <FormScreen />;
  if (screen === "edit") return <FormScreen editing />;

  return null;
}

function Field({ label, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8f7f5",
  },
  homeContent: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 30,
    minHeight: "100%",
  },
  chefIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff2bd",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
  },
  brand: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#262626",
    letterSpacing: -0.4,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 10,
    color: "#888",
    marginTop: 5,
  },
  countPill: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff2c9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 15,
    marginTop: 12,
  },
  countText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#d88700",
  },
  homeButtons: {
    gap: 10,
    marginTop: 25,
  },
  homeButton: {
    minHeight: 67,
    backgroundColor: "#fff",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#e8e6e3",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  homeButtonIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  homeButtonText: {
    flex: 1,
  },
  homeButtonTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#252525",
  },
  homeButtonSubtitle: {
    fontSize: 9,
    color: "#999",
    marginTop: 3,
  },
  header: {
    height: 58,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 62,
  },
  backText: {
    fontSize: 10,
    color: "#222",
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#272727",
  },
  addCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff2bd",
    alignItems: "center",
    justifyContent: "center",
  },
  formContent: {
    padding: 16,
    paddingBottom: 25,
  },
  field: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#555",
    marginBottom: 7,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e5e1",
    borderRadius: 8,
    minHeight: 42,
    paddingHorizontal: 12,
    fontSize: 10,
    color: "#333",
  },
  descriptionInput: {
    height: 72,
    paddingTop: 12,
  },
  courseRow: {
    flexDirection: "row",
    gap: 8,
  },
  courseOption: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  courseOptionActive: {
    backgroundColor: "#fff2bd",
    borderColor: "#e9c95b",
  },
  courseOptionText: {
    fontSize: 10,
    color: "#777",
    fontWeight: "600",
  },
  courseOptionTextActive: {
    color: "#9b6700",
    fontWeight: "800",
  },
  priceInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e5e1",
    borderRadius: 8,
    paddingLeft: 12,
  },
  currency: {
    fontSize: 11,
    color: "#777",
    fontWeight: "700",
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
  },
  formButtons: {
    marginTop: 105,
    gap: 8,
  },
  primaryButton: {
    height: 42,
    borderRadius: 9,
    backgroundColor: "#e68100",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  cancelButton: {
    height: 34,
    borderRadius: 9,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#555",
    fontSize: 9,
    fontWeight: "600",
  },
  menuContent: {
    padding: 10,
    paddingBottom: 25,
  },
  dishCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e5e1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 9,
  },
  dishTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dishName: {
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    color: "#2c2c2c",
    marginRight: 8,
  },
  badge: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 7,
    fontWeight: "900",
  },
  starterBadge: {
    backgroundColor: "#d8f6e7",
  },
  starterText: {
    color: "#248d5c",
  },
  mainBadge: {
    backgroundColor: "#ffecd8",
  },
  mainText: {
    color: "#df7a16",
  },
  dessertBadge: {
    backgroundColor: "#f7ddeb",
  },
  dessertText: {
    color: "#a92b69",
  },
  dishDescription: {
    color: "#777",
    fontSize: 8.5,
    lineHeight: 13,
    marginTop: 7,
    marginBottom: 8,
  },
  dishBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 11,
    fontWeight: "900",
    color: "#d87c00",
  },
  actions: {
    flexDirection: "row",
    gap: 7,
  },
  iconButton: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#e7e4e1",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#fff0f1",
    borderColor: "#ffd9dc",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
    color: "#444",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 10,
    marginTop: 5,
  },
  smallPrimaryButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#e68100",
    alignItems: "center",
    justifyContent: "center",
  },
});
