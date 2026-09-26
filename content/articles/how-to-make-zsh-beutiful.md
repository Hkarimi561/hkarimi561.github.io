---
title: "How to Make Your Zsh More Beautiful and Productive"
date: "2023-03-16"
excerpt: "Set up the Spaceship prompt theme, then layer on autosuggestions, syntax highlighting, and Autojump to make a plain zsh shell faster and nicer to use."
tags: ["zsh", "shell", "dotfiles"]
slug: "how-to-make-zsh-beutiful"
---

## Set up the Spaceship theme

### Download Spaceship theme

```shell
git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt" --depth=1
```

### Move theme to the ZSH Files

```shell
ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
```

### Then Change Theme Value in `.zshrc` to the spaceship

```shell
ZSH_THEME="spaceship"
```

## Additional

### install auto suggestion plugin

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

### Install syntax highlight

```shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

### At last install Autojump plugin

```shell
git clone https://github.com/wting/autojump.git
cd autojump
./install.py
```

### Then change plugin value in `.zshrc`

```shell
plugins=(git node autojump zsh-autosuggestions zsh-syntax-highlighting z)
```
