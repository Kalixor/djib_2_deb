import React, { useState } from "react";
import Select, { components } from "react-select";

const CustomMultiSelect = ({selectedOptions, setSelectedOptions, placeHolder = "", fowardChange, taxeFilter = [], options = [] }) => {
    // const [selectedOptions, setSelectedOptions] = useState(taxeFilter);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    //  const customStyles = {
    //   control: (base, state) => ({
    //     ...base,
    //     minWidth: "100px",
    //     overflow: "hidden",
    //     whiteSpace: "nowrap",
    //     textOverflow: "ellipsis",
    //     backgroundColor: "#081028", // Fond d'arrière-plan
    //     borderColor: 'rgba(0, 194, 255, 0.5)', // Bordure visible au focus et au hover
    //     color: "#aeb9e1", // Police
    //     transition: "border-color 0.2s ease-in-out", // Ajoute une transition fluide
    //     '&:hover': {
    //         borderColor: '#00c2ff'
    //       }
    //   }),
    //   menu: (base) => ({
    //     ...base,
    //     minWidth: "100px",
    //     backgroundColor: "#081028", // Fond d'arrière-plan
    //   }),
    //   input: (base) => ({
    //     ...base,
    //     color: "#aeb9e1", // Couleur du texte saisi
    //     caretColor: "#aeb9e1", // Couleur du curseur de saisie
    //   }),
    //   multiValue: (base) => ({
    //     ...base,
    //     display: "flex",
    //     flexDirection: "row",
    //     alignItems: "center",
    //     overflow: "hidden",
    //     textOverflow: "ellipsis",
    //     maxWidth: "100%",
    //     flexWrap: "nowrap",
    //     backgroundColor: "rgba(0, 194, 255, 0.5)", // Badges fond semi-transparent
    //     borderRadius: "2px",
    //     padding: "2px 3px",
    //   }),
    //   multiValueLabel: (base) => ({
    //     ...base,
    //     whiteSpace: "nowrap",
    //     overflow: "hidden",
    //     textOverflow: "ellipsis",
    //     color: "#081028", // Texte des badges contrasté
    //   }),
    //   multiValueRemove: (base) => ({
    //     ...base,
    //     display: "flex",
    //     alignItems: "center",
    //   }),
    //   valueContainer: (base) => ({
    //     ...base,
    //     display: "flex",
    //     flexWrap: "nowrap",
    //     overflow: "hidden",
    //     color: "#aeb9e1", // Police de saisie
    //   }),
    //   dropdownIndicator: (base) => ({
    //     ...base,
    //     color: '#aeb9e1',
    //     padding: '4px',
    //     '&:hover': {
    //       color: '#00c2ff'
    //     }
    //   }),
    //   indicatorSeparator: (base) => ({
    //     ...base,
    //     display: "none", // Supprime la barre de séparation
    //   }),
    //   option: (base, state) => ({
    //     ...base,
    //     backgroundColor: state.isFocused ? "#00c2ff" : "#081028", // Hover et fond des items
    //     color: "#aeb9e1", // Police
    //     display: "flex",
    //     justifyContent: "flex-start",
    //     alignItems: "center",
    //     cursor: "pointer",
    //     gap: "8px",
    //   }),
    //   placeholder: (base) => ({
    //     ...base,
    //     color: "#aeb9e1", // Placeholder color
    //   }),
    //   clearIndicator: (base) => ({
    //     ...base,
    //     color: '#aeb9e1',
    //     padding: '4px',
    //     '&:hover': {
    //       color: '#00c2ff'
    //     }
    //   })
    // };

    const customStyles = {
        control: (base) => ({
            ...base,
            backgroundColor: 'rgba(8, 16, 40, 0.5)',
            backdropFilter: 'blur(12px)',
            borderColor: 'rgba(0, 194, 255, 0.5)',
            minHeight: '32px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#00c2ff'
            }
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#0b1739',
            border: '1px solid rgba(0, 194, 255, 0.5)',
            backdropFilter: 'blur(12px)'
        }),
        // option: (provided, state) => ({
        //     ...provided,
        //     backgroundColor: state.isSelected ? '#00c2ff' : 'transparent',
        //     color: state.isSelected ? '#0b1739' : '#aeb9e1',
        //     '&:hover': {
        //         backgroundColor: '#00c2ff',
        //         color: '#0b1739'
        //     }
        // }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#00c2ff" : "#081028", // Hover et fond des items
            color: state.isFocused ? '#0b1739' : '#aeb9e1',
            // color: "#aeb9e1", // Police
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            cursor: "pointer",
            gap: "8px",
            padding: "8px", // Ajoute un espacement interne
            margin: "5px 0", // Ajoute un espace entre chaque élément
            borderRadius: "5px", // Arrondi les bords pour un meilleur look
          }),
        singleValue: (base) => ({
            ...base,
            color: '#aeb9e1'
        }),
        valueContainer: (base) => ({
            ...base,
            display: "flex",
            flexWrap: "nowrap",
            overflow: "hidden",
            color: "#aeb9e1", // Police de saisie
          }),
        multiValue: (base) => ({
            ...base,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            flexWrap: "nowrap",
            backgroundColor: 'rgba(0, 194, 255, 0.1)',
            // border: '1px solid rgba(0, 194, 255, 0.5)',
            borderRadius: "4px",
            padding: "2px 5px",

        }),
        multiValueRemove: (base, state) => ({
            ...base,
            display: "flex",
            alignItems: "center",
            color: "#00c2ff", // Couleur par défaut
            cursor: "pointer",
            ":hover": {
                backgroundColor: "#00c2ff", // Couleur de fond au survol
                color: "#081028", // Couleur de l'icône de suppression au survol
            },
        }),
        input: (provided) => ({
            ...provided,
            color: '#aeb9e1'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#aeb9e1'
        }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#aeb9e1',
            padding: '4px',
            '&:hover': {
                color: '#00c2ff'
            }
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: '#aeb9e1',
            padding: '4px',
            '&:hover': {
                color: '#00c2ff'
            }
        })
    }

    const CustomOption = (props) => {
        const { data, isSelected, innerRef, innerProps } = props;
        return (
            <div ref={innerRef} {...innerProps} style={customStyles.option({}, { isSelected, isFocused: props.isFocused })}>
                {isSelected && <span>✔</span>} {/* Ajoute un check avant les éléments sélectionnés */}
                {data.label}
            </div>
        );
    };

    const CustomMultiValueLabel = (props) => {
        return (
          <div style={{ position: "relative" }}>
            <div 
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                color: "#00c2ff",
              }}
              title={props.data.label} // Tooltip natif
            >
              {props.data.label}
            </div>
          </div>
        );
      };
    
    const handleChange = (selected) => {
        setSelectedOptions(selected || []);
        setMenuIsOpen(false);
        fowardChange(selected)
    };

    return (
        <Select
            options={options}
            isMulti
            hideSelectedOptions={false}
            closeMenuOnSelect={true}
            value={selectedOptions}
            onChange={handleChange}
            onMenuOpen={() => setMenuIsOpen(true)}
            onMenuClose={() => setMenuIsOpen(false)}
            menuIsOpen={menuIsOpen}
            placeholder={placeHolder}
            isClearable
            styles={customStyles}
            classNamePrefix="react-select"
            components={{
                Option: CustomOption,
                MultiValueLabel: CustomMultiValueLabel, // Applique le tooltip
              }}
            noOptionsMessage={() => "Aucune option disponible"}
        />
    );
};

export default CustomMultiSelect;
