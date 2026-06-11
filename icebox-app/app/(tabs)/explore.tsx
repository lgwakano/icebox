import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Fridge Manager</ThemedText>
      </ThemedView>

      <ThemedText>
        Welcome to the Fridge Manager! Use this app to keep track of what's in your fridge, manage expiry dates, and avoid wasting food.
      </ThemedText>

      <Button title="Add New Item" onPress={() => alert('Navigate to Add Item Modal')} />

      <Collapsible title="Manage Your Fridge">
        <ThemedText>
          You can add new items to your fridge, see what's available, and remove expired items. Keep your fridge organized and fresh!
        </ThemedText>
        <Button title="View Fridge Items" onPress={() => alert('Navigate to Fridge List Screen')} />
      </Collapsible>

      <Collapsible title="Expiry Warnings">
        <ThemedText>
          The app will notify you when items are about to expire, so you can use them before they go bad. No more wasted food!
        </ThemedText>
      </Collapsible>

      <Collapsible title="Search & Filter">
        <ThemedText>
          You can search for items by name or filter by categories like dairy, meat, or vegetables. Keep your fridge organized with ease.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Notifications">
        <ThemedText>
          Receive notifications about items nearing their expiry date. You can set up reminders to use them up!
        </ThemedText>
      </Collapsible>

      <ExternalLink href="https://docs.expo.dev/router/introduction">
        <ThemedText type="link">Learn more about this app</ThemedText>
      </ExternalLink>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
