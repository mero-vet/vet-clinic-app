# PIMS Documentation

This directory contains documentation for the Multi-PIMS Simulation feature of the Vet Clinic App. The feature allows users to switch between different Practice Information Management System (PIMS) interfaces, each with its own unique visual design, navigation patterns, terminology, and workflows.

## Contents

### PIMS Interface Documentation
- [01-Cornerstone.md](./01-Cornerstone.md) - Documentation for the Cornerstone PIMS interface
- [02-Avimark.md](./02-Avimark.md) - Documentation for the Avimark PIMS interface
- [03-EasyVet.md](./03-EasyVet.md) - Documentation for the EasyVet PIMS interface
- [04-IntraVet.md](./04-IntraVet.md) - Documentation for the IntraVet PIMS interface
- [05-Covetrus.md](./05-Covetrus.md) - Documentation for the Covetrus Pulse PIMS interface

### Comparison and Training Resources
- [PIMS-Comparison.md](./PIMS-Comparison.md) - Side-by-side comparison of all PIMS interfaces
- [AI-Agent-Training-Guide.md](./AI-Agent-Training-Guide.md) - Guide for training AI agents to work with multiple PIMS

## Purpose

This documentation serves several purposes:

1. **Developer Reference**: Provides detailed information about the implementation of each PIMS interface.
2. **User Guide**: Helps users understand the differences between PIMS interfaces and how to work with them.
3. **AI Training**: Serves as a resource for training AI agents to recognize and work with different PIMS interfaces.
4. **Project Documentation**: Documents the Multi-PIMS Simulation feature for project records.

## Implementation Details

The Multi-PIMS Simulation feature is implemented through several key components:

- **PIMSContext**: A React context that manages the current PIMS state and provides methods for switching between PIMS.
- **PIMSSelector**: A UI component that allows users to select which PIMS interface to display.
- **Layout Components**: Separate layout components for each PIMS that implement their unique visual design and navigation patterns.
- **Configuration Registry**: A comprehensive configuration object that defines the UI/UX elements, terminology, and other characteristics of each PIMS.
- **Theme System**: A CSS variables-based theming system that applies the appropriate styling for each PIMS.
- **URL-Based Navigation**: PIMS selection is stored in the URL (e.g., `/cornerstone/scheduler`, `/avimark/notes`), making it resilient to page refreshes and providing bookmarkable URLs.

## Project Status

The Multi-PIMS Simulation feature is approximately 90% complete. All PIMS interfaces have been implemented, and the basic functionality for switching between them is working. The remaining tasks include comprehensive testing, bug fixing, performance optimization, and completion of documentation.

See the [PRD-02-MultiPIMSSimulation.md](../PRD/PRD-02-MultiPIMSSimulation.md) document for a detailed progress tracking. 