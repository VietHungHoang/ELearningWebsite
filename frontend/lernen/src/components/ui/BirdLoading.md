# BirdLoading Component

A reusable bird loading animation component extracted from the OAuth callback page.

## Preview

The bird loader features an animated bird with flapping wings - perfect for loading states in your application.

## Usage

### Basic Usage

```tsx
import BirdLoading from '@/components/ui/BirdLoading';

function MyComponent() {
  return <BirdLoading />;
}
```

### With Custom Text

```tsx
<BirdLoading 
  title="Signing you in..." 
  description="Please wait while we complete your sign in"
/>
```

### Different Sizes

```tsx
{/* Small */}
<BirdLoading size="sm" title="Loading..." />

{/* Medium (default) */}
<BirdLoading size="md" title="Loading..." />

{/* Large */}
<BirdLoading size="lg" title="Loading..." />
```

### Custom Styling

```tsx
<BirdLoading 
  className="my-custom-class"
  title="Processing..."
  description="This may take a moment"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Loading..."` | Title text displayed below the animation |
| `description` | `string` | `undefined` | Optional description text below the title |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant of the bird loader |
| `className` | `string` | `""` | Additional CSS classes for the container |

## Examples

### In a Full Page Loading State

```tsx
<div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
  <BirdLoading 
    title="Signing you in..." 
    description="Please wait while we complete your sign in"
  />
</div>
```

### In a Modal

```tsx
<Modal>
  <BirdLoading 
    size="sm"
    title="Processing payment..." 
  />
</Modal>
```

### In a Card

```tsx
<Card className="p-8">
  <BirdLoading 
    title="Loading your profile..."
    description="Just a moment"
  />
</Card>
```

## Design

The bird is styled with:
- Body color: `#935936` (brown)
- Head color: `#0b6459` (teal green)
- Beak color: `#ef524a` (red-orange)
- White eye dot
- Tail: teal green

The animation creates a wing-flapping effect that loops smoothly.
