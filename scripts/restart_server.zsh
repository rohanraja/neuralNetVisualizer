server_window="server" 
tmux send-keys -t "$server_window" C-c
tmux send-keys -t "$server_window" "python main.py" Enter

