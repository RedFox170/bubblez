# Neues Styling

## Infos

- neue Stylingdatein in mainComponents - styling
- reusable soll nicht mehr genutzt werden so dass der code nicht zumüllt.

## Background Gradient Animation
https://www.gradient-animator.com/
color1 - #161f82
color2 - #034191
color3 - #411682

.css-selector {
    background: linear-gradient(205deg, #161f82, #034191, #411682);
    background-size: 600% 600%;

    -webkit-animation: AnimationBackground 34s ease infinite;
    -moz-animation: AnimationBackground 34s ease infinite;
    -o-animation: AnimationBackground 34s ease infinite;
    animation: AnimationBackground 34s ease infinite;
}

@-webkit-keyframes AnimationBackground {
    0%{background-position:50% 0%}
    50%{background-position:51% 100%}
    100%{background-position:50% 0%}
}
@-moz-keyframes AnimationBackground {
    0%{background-position:50% 0%}
    50%{background-position:51% 100%}
    100%{background-position:50% 0%}
}
@-o-keyframes AnimationBackground {
    0%{background-position:50% 0%}
    50%{background-position:51% 100%}
    100%{background-position:50% 0%}
}
@keyframes AnimationBackground {
    0%{background-position:50% 0%}
    50%{background-position:51% 100%}
    100%{background-position:50% 0%}
}


## Bubblez inspiration

https://www.youtube.com/watch?v=5LGFxmkuQV0


