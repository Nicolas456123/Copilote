import { View, type ViewProps } from 'react-native';

export default function Card({ children, className = '', ...rest }: ViewProps & { className?: string }) {
  return (
    <View
      className={`bg-surface rounded-3xl p-4 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </View>
  );
}
