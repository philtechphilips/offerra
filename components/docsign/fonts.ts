export interface FontConfig {
    id: string;
    name: string;
    url: string;
    category: 'Sans Serif' | 'Serif' | 'Handwriting' | 'Monospace' | 'Display';
}

export const ADDITIONAL_FONTS: FontConfig[] = [
    // Sans Serif
    { id: 'Roboto', name: 'Roboto', category: 'Sans Serif', url: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.ttf' },
    { id: 'Open Sans', name: 'Open Sans', category: 'Sans Serif', url: 'https://fonts.gstatic.com/s/opensans/v40/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.ttf' },
    { id: 'Lato', name: 'Lato', category: 'Sans Serif', url: 'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.ttf' },
    { id: 'Montserrat', name: 'Montserrat', category: 'Sans Serif', url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4MV93gzAY.ttf' },
    { id: 'Oswald', name: 'Oswald', category: 'Sans Serif', url: 'https://fonts.gstatic.com/s/oswald/v49/TK3iWkUHHAIjg752GT8G.ttf' },
    { id: 'Raleway', name: 'Raleway', category: 'Sans Serif', url: 'https://fonts.gstatic.com/s/raleway/v29/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCIPrQ.ttf' },
    { id: 'Nunito', name: 'Nunito', category: 'Sans Serif', url: 'https://fonts.gstatic.com/s/nunito/v26/JyFY7SLS_94gR7_vsh-6.ttf' },
    { id: 'Ubuntu', name: 'Ubuntu', category: 'Sans Serif', url: 'https://fonts.gstatic.com/s/ubuntu/v20/4iCs6KVjbNBYlgo6eA.ttf' },
    { id: 'Poppins', name: 'Poppins', category: 'Sans Serif', url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJM.ttf' },
    { id: 'Playfair Display', name: 'Playfair Display', category: 'Serif', url: 'https://fonts.gstatic.com/s/playfairdisplay/v37/6nuTXUZF3O3mwcmvu3W6-W22mC5X686K_Zp8Y0r7XW8.ttf' },
    
    // Serif
    { id: 'Merriweather', name: 'Merriweather', category: 'Serif', url: 'https://fonts.gstatic.com/s/merriweather/v30/u-440qy0oWG6pwW1O0r18GN0A6T0.ttf' },
    { id: 'Lora', name: 'Lora', category: 'Serif', url: 'https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuAw9uJtY.ttf' },
    { id: 'PT Serif', name: 'PT Serif', category: 'Serif', url: 'https://fonts.gstatic.com/s/ptserif/v17/EJRVQgBy6hy7_Q0U9XCc.ttf' },
    { id: 'Crimson Text', name: 'Crimson Text', category: 'Serif', url: 'https://fonts.gstatic.com/s/crimsontext/v21/w9X6Lm6E6-BeS7FyuRQX5-E.ttf' },
    { id: 'Arvo', name: 'Arvo', category: 'Serif', url: 'https://fonts.gstatic.com/s/arvo/v20/tDbD2oWUg0MKqScA.ttf' },
    { id: 'EB Garamond', name: 'EB Garamond', category: 'Serif', url: 'https://fonts.gstatic.com/s/ebgaramond/v26/SlGDm7hS43iWVnvMk-6_Wzc.ttf' },
    { id: 'Libre Baskerville', name: 'Libre Baskerville', category: 'Serif', url: 'https://fonts.gstatic.com/s/librebaskerville/v14/kmKiZpfIFsh7_02uzCAlnd_dc30.ttf' },
    
    // Handwriting
    { id: 'Dancing Script', name: 'Dancing Script', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/dancingscript/v25/If2cXTr6YS-zF4S-RwUcAZ8.ttf' },
    { id: 'Pacifico', name: 'Pacifico', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/pacifico/v22/FwZY7W_6L_8mOClRcEU.ttf' },
    { id: 'Caveat', name: 'Caveat', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/caveat/v18/WnER7K_7_3mDYC0.ttf' },
    { id: 'Satisfy', name: 'Satisfy', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/satisfy/v17/r06e22S_Wb4u6ZfR880.ttf' },
    { id: 'Courgette', name: 'Courgette', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/courgette/v13/6xKtd09IDm43I66mLA8.ttf' },
    { id: 'Great Vibes', name: 'Great Vibes', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/greatvibes/v15/RWm0oL6io7ZYvO06-Ow.ttf' },
    { id: 'Lobster', name: 'Lobster', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/lobster/v30/neolBSuS_o7Tfxcv.ttf' },
    { id: 'Shadows Into Light', name: 'Shadows Into Light', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/shadowsintolight/v19/Uqy9p_7ST9NSIn7v4Uf0-fJuyA.ttf' },
    { id: 'Indie Flower', name: 'Indie Flower', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/indieflower/v17/m0B7p_S6Xp9W3_S-hE-G.ttf' },
    { id: 'Permanent Marker', name: 'Permanent Marker', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/permanentmarker/v16/Fh4uP1pM_0E_f.ttf' },
    { id: 'Amatic SC', name: 'Amatic SC', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/amaticsc/v26/T6fW3_YLyB2K_N4o.ttf' },
    { id: 'Cookie', name: 'Cookie', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/cookie/v17/t6PW34H_2u06968.ttf' },
    { id: 'Sacramento', name: 'Sacramento', category: 'Handwriting', url: 'https://fonts.gstatic.com/s/sacramento/v13/buEz7z06G31X2wPC.ttf' },
    
    // Monospace
    { id: 'Roboto Mono', name: 'Roboto Mono', category: 'Monospace', url: 'https://fonts.gstatic.com/s/robotomono/v23/L0xkDFCNMwE9EO6mU_sgv-0.ttf' },
    { id: 'Inconsolata', name: 'Inconsolata', category: 'Monospace', url: 'https://fonts.gstatic.com/s/inconsolata/v32/QlddNTeS8emjn.ttf' },
    { id: 'Source Code Pro', name: 'Source Code Pro', category: 'Monospace', url: 'https://fonts.gstatic.com/s/sourcecodepro/v23/HI_diYsKILvXYV6S29W-E.ttf' },
    { id: 'Fira Mono', name: 'Fira Mono', category: 'Monospace', url: 'https://fonts.gstatic.com/s/firamono/v14/N0bX2SlDW_B1.ttf' },
    { id: 'VT323', name: 'VT323', category: 'Monospace', url: 'https://fonts.gstatic.com/s/vt323/v17/pxiKyp8kv8JHgFVrFJM.ttf' },
    { id: 'Space Mono', name: 'Space Mono', category: 'Monospace', url: 'https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZP5ceAe8vX.ttf' },
    
    // Display / Fun
    { id: 'Bebas Neue', name: 'Bebas Neue', category: 'Display', url: 'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg1_i6t8kCHKm4MV93gzAY.ttf' },
    { id: 'Abril Fatface', name: 'Abril Fatface', category: 'Display', url: 'https://fonts.gstatic.com/s/abrilfatface/v23/zOL64pLDMFrL-Zp74-85.ttf' },
    { id: 'Righteous', name: 'Righteous', category: 'Display', url: 'https://fonts.gstatic.com/s/righteous/v17/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCIPrQ.ttf' },
    { id: 'Bangers', name: 'Bangers', category: 'Display', url: 'https://fonts.gstatic.com/s/bangers/v21/NuFv7_EYS2n21MOMyA.ttf' },
    { id: 'Cinzel', name: 'Cinzel', category: 'Display', url: 'https://fonts.gstatic.com/s/cinzel/v19/8vXU7V8vXU7V8vXU.ttf' },
    { id: 'Alfa Slab One', name: 'Alfa Slab One', category: 'Display', url: 'https://fonts.gstatic.com/s/alfaslabone/v16/6nuTXUZF3O3mwcmvu3W6-W22mC5X686K_Zp8Y0r7XW8.ttf' },
    { id: 'Special Elite', name: 'Special Elite', category: 'Display', url: 'https://fonts.gstatic.com/s/specialelite/v18/6nuTXUZF3O3mwcmvu3W6-W22mC5X686K_Zp8Y0r7XW8.ttf' },
    { id: 'Luckiest Guy', name: 'Luckiest Guy', category: 'Display', url: 'https://fonts.gstatic.com/s/luckiestguy/v18/6nuTXUZF3O3mwcmvu3W6-W22mC5X686K_Zp8Y0r7XW8.ttf' },
    { id: 'Fredoka One', name: 'Fredoka One', category: 'Display', url: 'https://fonts.gstatic.com/s/fredokaone/v13/6nuTXUZF3O3mwcmvu3W6-W22mC5X686K_Zp8Y0r7XW8.ttf' },
    { id: 'Press Start 2P', name: 'Press Start 2P', category: 'Display', url: 'https://fonts.gstatic.com/s/pressstart2p/v15/6nuTXUZF3O3mwcmvu3W6-W22mC5X686K_Zp8Y0r7XW8.ttf' },
    { id: 'Monoton', name: 'Monoton', category: 'Display', url: 'https://fonts.gstatic.com/s/monoton/v15/6nuTXUZF3O3mwcmvu3W6-W22mC5X686K_Zp8Y0r7XW8.ttf' },
    { id: 'Comfortaa', name: 'Comfortaa', category: 'Display', url: 'https://fonts.gstatic.com/s/comfortaa/v45/6nuTXUZF3O3mwcmvu3W6-W22mC5X686K_Zp8Y0r7XW8.ttf' },
    { id: 'Orbitron', name: 'Orbitron', category: 'Display', url: 'https://fonts.gstatic.com/s/orbitron/v25/6nuTXUZF3O3mwcmvu3W6-W22mC5X686K_Zp8Y0r7XW8.ttf' },
    { id: 'Quicksand', name: 'Quicksand', category: 'Display', url: 'https://fonts.gstatic.com/s/quicksand/v30/6nuTXUZF3O3mwcmvu3W6-W22mC5X686K_Zp8Y0r7XW8.ttf' }
];
