# Create Cursor Rule

Generate a new cursor rule based on the provided information.

## Usage
Describe the rule you want to create, and I'll add it to your `.cursorrules` file.

## Format
Rules should follow this structure:

**Category**: [Coding Style / Architecture / Testing / Documentation / etc.]
**Description**: Brief description of what this rule enforces
**Rule**: The actual rule content

## Examples

### Example 1: Coding Style Rule
- **Category**: Coding Style
- **Description**: File naming conventions
- **Rule**: Use kebab-case for file names (e.g., `my-component.tsx`)

### Example 2: Architecture Rule
- **Category**: Architecture  
- **Description**: Component organization
- **Rule**: Place all React components in `src/components` directory and hooks in `src/hooks` directory

### Example 3: Code Convention
- **Category**: Code Convention
- **Description**: Component export pattern
- **Rule**: Always use `export default function ComponentName() {}` for components and hooks

## Instructions
After you describe your rule, I will:
1. Format it appropriately
2. Add it to your `.cursorrules` file (creating it if it doesn't exist)
3. Organize it under the appropriate category
4. Ensure no duplicates exist

## What to provide
Simply tell me:
- What behavior or convention you want enforced
- Any specific examples or context
- The category (optional - I can infer it)

Example prompts:
- "Create a rule that all API calls should use the fetch wrapper in utils"
- "Add a rule about using TypeScript strict mode"
- "I want a rule that tests should be colocated with components"
