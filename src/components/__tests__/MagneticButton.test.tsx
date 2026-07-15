import React from 'react'
import { render, screen } from '@testing-library/react'
import MagneticButton from '../MagneticButton'

describe('MagneticButton', () => {
  it('renders children correctly', () => {
    render(<MagneticButton>Click me</MagneticButton>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
