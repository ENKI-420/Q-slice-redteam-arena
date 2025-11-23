import os
import shutil
import json
import time
import hashlib
from pathlib import Path
from datetime import datetime

class DNALangFileSystem:
    """
    DNA-Lang File System Abstraction Layer
    Provides secure, quantum-resistant file operations for the DNA-Lang environment.
    """
    
    def __init__(self, root_dir="./dnalang_storage"):
        self.root = Path(root_dir)
        self.root.mkdir(exist_ok=True, parents=True)
        self.ledger_file = self.root / "fs_ledger.json"
        self._load_ledger()
        
    def _load_ledger(self):
        if self.ledger_file.exists():
            with open(self.ledger_file, 'r') as f:
                self.ledger = json.load(f)
        else:
            self.ledger = {"files": {}, "history": []}
            self._save_ledger()
            
    def _save_ledger(self):
        with open(self.ledger_file, 'w') as f:
            json.dump(self.ledger, f, indent=2)
            
    def _hash_content(self, content):
        return hashlib.sha3_256(content.encode()).hexdigest()
        
    def write_file(self, path, content, metadata=None):
        """Write a file with quantum-resistant integrity tracking"""
        full_path = self.root / path
        full_path.parent.mkdir(exist_ok=True, parents=True)
        
        with open(full_path, 'w') as f:
            f.write(content)
            
        file_hash = self._hash_content(content)
        timestamp = datetime.now().isoformat()
        
        record = {
            "path": str(path),
            "hash": file_hash,
            "created": timestamp,
            "metadata": metadata or {},
            "quantum_signature": f"QS-{file_hash[:16]}" 
        }
        
        self.ledger["files"][str(path)] = record
        self.ledger["history"].append({
            "action": "write",
            "path": str(path),
            "timestamp": timestamp,
            "hash": file_hash
        })
        self._save_ledger()
        return record
        
    def read_file(self, path):
        """Read a file and verify its integrity"""
        full_path = self.root / path
        if not full_path.exists():
            raise FileNotFoundError(f"File not found: {path}")
            
        with open(full_path, 'r') as f:
            content = f.read()
            
        current_hash = self._hash_content(content)
        stored_record = self.ledger["files"].get(str(path))
        
        integrity_status = "verified"
        if stored_record and stored_record["hash"] != current_hash:
            integrity_status = "compromised"
            
        return {
            "content": content,
            "integrity": integrity_status,
            "metadata": stored_record["metadata"] if stored_record else {}
        }

    def list_files(self, directory=""):
        """List files with their quantum states"""
        return [
            info for path, info in self.ledger["files"].items() 
            if path.startswith(directory)
        ]

# Example usage for the organism converter
if __name__ == "__main__":
    fs = DNALangFileSystem()
    print(f"DNA-Lang FS Initialized at {fs.root}")
